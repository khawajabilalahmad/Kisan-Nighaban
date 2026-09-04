import sqlite3

def patch_database():
    conn = sqlite3.connect('kisan_nighaban.db')
    cursor = conn.cursor()

    try:
        cursor.execute("ALTER TABLE farms ADD COLUMN area FLOAT DEFAULT 0.0")
        print("Successfully added 'area' column to 'farms' table.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("Column 'area' already exists in 'farms' table.")
        else:
            print(f"Error: {e}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    patch_database()
