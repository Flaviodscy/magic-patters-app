import { supabase } from './supabase';
export const DatabaseService = {
  // Check if the database is properly initialized
  async checkDatabaseSetup(): Promise<{
    initialized: boolean;
    message: string;
  }> {
    try {
      // Check if profiles table exists by attempting to query it
      const {
        error: profilesError
      } = await supabase.from('profiles').select('count', {
        count: 'exact',
        head: true
      });
      // Check if measurements table exists
      const {
        error: measurementsError
      } = await supabase.from('measurements').select('count', {
        count: 'exact',
        head: true
      });
      if (profilesError && profilesError.message.includes('relation "profiles" does not exist')) {
        return {
          initialized: false,
          message: 'Database tables not found. Please initialize the database.'
        };
      }
      if (measurementsError && measurementsError.message.includes('relation "measurements" does not exist')) {
        return {
          initialized: false,
          message: 'Measurements table not found. Please initialize the database.'
        };
      }
      return {
        initialized: true,
        message: 'Database is properly set up.'
      };
    } catch (error) {
      console.error('Error checking database setup:', error);
      return {
        initialized: false,
        message: `Error checking database: ${error.message || 'Unknown error'}`
      };
    }
  },
  // Initialize the database by creating necessary tables
  async initializeDatabase(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Try to create the profiles table using direct SQL
      const {
        error: profilesError
      } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id),
            name TEXT,
            email TEXT,
            phone TEXT,
            address TEXT,
            photo_url TEXT,
            sleep_position TEXT,
            sleep_time TEXT,
            wake_time TEXT,
            location TEXT,
            notifications BOOLEAN DEFAULT true,
            sleep_score INTEGER DEFAULT 0,
            comfort_score INTEGER DEFAULT 0,
            posture_score INTEGER DEFAULT 0,
            routine_tasks JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      }).catch(err => {
        console.error('SQL execution error:', err);
        return {
          error: err
        };
      });
      if (profilesError) {
        // If direct SQL fails, try a simpler approach
        console.error('Error creating profiles table:', profilesError);
        // Try a simple insert instead
        const {
          error: insertError
        } = await supabase.from('profiles').insert([{
          id: '00000000-0000-0000-0000-000000000000',
          name: 'test'
        }]).single();
        if (insertError && !insertError.message.includes('duplicate key')) {
          throw new Error(`Failed to create profiles table: ${insertError.message}`);
        }
      }
      // Try to create the measurements table using direct SQL
      const {
        error: measurementsError
      } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS measurements (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id),
            neckLength NUMERIC,
            neckWidth NUMERIC,
            sleepPosition TEXT,
            score INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      }).catch(err => {
        console.error('SQL execution error:', err);
        return {
          error: err
        };
      });
      if (measurementsError) {
        console.error('Error creating measurements table:', measurementsError);
        // Try a simple insert instead
        const {
          error: insertError
        } = await supabase.from('measurements').insert([{
          id: '00000000-0000-0000-0000-000000000000',
          user_id: '00000000-0000-0000-0000-000000000000',
          neckLength: 0,
          neckWidth: 0,
          sleepPosition: 'back',
          score: 0
        }]).single();
        if (insertError && !insertError.message.includes('duplicate key')) {
          throw new Error(`Failed to create measurements table: ${insertError.message}`);
        }
      }
      return {
        success: true,
        message: 'Database initialized successfully!'
      };
    } catch (error) {
      console.error('Error initializing database:', error);
      return {
        success: false,
        message: `Database initialization failed: ${error.message}. You may need to manually create the tables in the Supabase dashboard.`
      };
    }
  }
};