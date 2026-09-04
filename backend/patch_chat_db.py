import sqlite3

def patch_database():
    conn = sqlite3.connect('kisan_nighaban.db')
    cursor = conn.cursor()

    try:
        cursor.execute("ALTER TABLE chat_sessions ADD COLUMN user_id VARCHAR")
        print("Successfully added 'user_id' column to 'chat_sessions' table.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("Column 'user_id' already exists in 'chat_sessions' table.")
        else:
            print(f"Error: {e}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    patch_database()
