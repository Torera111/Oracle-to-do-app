const oracledb = require("oracledb");

async function run() {
  let connection;

  try {
    // Connect to Oracle
    connection = await oracledb.getConnection({
      user: "demonode",
      password: "1234",
      connectString: "localhost/FREEPDB1",
    });

    console.log("✅ Successfully connected to Oracle Database");

    // Drop the table if it exists
    await connection.execute(`
      BEGIN
        EXECUTE IMMEDIATE 'DROP TABLE todoitem';
      EXCEPTION
        WHEN OTHERS THEN
          IF SQLCODE != -942 THEN
            RAISE;
          END IF;
      END;
    `);

    // Create a new table
    await connection.execute(`
      CREATE TABLE todoitem (
        id NUMBER GENERATED ALWAYS AS IDENTITY,
        description VARCHAR2(4000),
        creation_ts TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        done NUMBER(1,0),
        PRIMARY KEY (id)
      )
    `);

    console.log("🗃️ Table created successfully");

    // Insert sample data
    const sql = `INSERT INTO todoitem (description, done) VALUES (:1, :2)`;
    const rows = [
      ["Buy groceries", 0],
      ["Walk the dog", 0],
      ["Read a book", 0],
      ["Write code", 0],
      ["Exercise", 0],
    ];

    const result = await connection.executeMany(sql, rows);
    console.log(`✅ ${result.rowsAffected} Rows Inserted`);
    await connection.commit();

    // Query results
    const queryResult = await connection.execute(
      `SELECT description, done FROM todoitem`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log("\n📋 Todo List:");
    queryResult.rows.forEach((row) => {
      console.log(`- ${row.DESCRIPTION} (${row.DONE ? "Done" : "Not done"})`);
    });
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("\n🔒 Connection closed");
      } catch (err) {
        console.error(err);
      }
    }
  }
}

// 👇 Run the async function
run();
