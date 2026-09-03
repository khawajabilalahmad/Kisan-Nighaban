import sqlite3

def patch_db():
    conn = sqlite3.connect('kisan_nighaban.db')
    cursor = conn.cursor()
    
    try:
        # Check if mobile_number column exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'mobile_number' not in columns:
            print("Adding mobile_number column to users table...")
            cursor.execute("ALTER TABLE users ADD COLUMN mobile_number VARCHAR")
            # Update existing rows to have a dummy mobile number so the NOT NULL constraint in model doesn't fail on read, though sqlite ALTER TABLE without NOT NULL allows nulls.
            cursor.execute("UPDATE users SET mobile_number = '00000000000' WHERE mobile_number IS NULL")
            conn.commit()
            print("Successfully added mobile_number.")
        else:
            print("mobile_number column already exists.")
            
    except Exception as e:
        print(f"Error patching DB: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    patch_db()
