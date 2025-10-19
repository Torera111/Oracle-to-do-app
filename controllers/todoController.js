const { getConnection, oracledb } = require('../config/db');


//Get all Todos
exports.getTodos = async (req, res) =>{
     console.log("📥 Received request to GET /todos");
    let connection;
    try{
        connection = await getConnection();
        console.log("✅ Connected to Oracle Database!");
        const result = await connection.execute(
            "SELECT id, description, done FROM todoitem ORDER BY id",
            []
        );
        res.json(result.rows || [])
    } catch (err){
        console.error("❌ Error in getTodos:", err.message);
        res.status(500).send("Error fetching todos")
    } finally{
        if (connection)await connection.close();
    }
};

exports.addTodo = async (req, res) => {
    const { description } = req.body;
     console.log("Received body:", req.body);
    if (!description) {
        return res.status(400).send("Description is required");
    }
    let connection;
    try{
        connection = await getConnection();
        // Use RETURNING INTO to get the generated id back from Oracle
        const result = await connection.execute(
            "INSERT INTO todoitem(description, done) VALUES (:description, 0) RETURNING id INTO :id",
            {
                description,
                id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            },
            { autoCommit: true }
        );

        const createdId = result.outBinds && result.outBinds.id ? result.outBinds.id[0] || result.outBinds.id : result.outBinds.id;
        // Return created todo as JSON so front-end can show id without reloading
        res.status(201).json({ id: createdId, description, done: 0 });
    } catch(err){
        console.error(err);
        res.status(500).send("Error adding todo");
    } finally {
       if (connection) await connection.close();
    }

};

//update todo
exports.updateTodo= async (req, res)=>{
    const { id } = req.params;
    const { done } = req.body;
    let connection;
    try{
        connection = await getConnection();
                await connection.execute(
            " UPDATE todoitem SET done = :1 where id = :2",
            [done, id]
        );
         await connection.commit();
        res.send("Todo updated successfully")
    } catch(err){
        console.error(err);
        res.status(500).send("Error updating todo");
    } finally {
       if (connection)await connection.close();
    }       
}

exports.deleteTodo = async (req, res)=>{
    const { id } = req.params;
    let connection;
    try{
        connection = await getConnection();
                await connection.execute(
            " DELETE FROM todoitem where id = :1",
            [id]
        );
         await connection.commit();
        res.send("Todo DELETED successfully")
    } catch(err){
        console.error(err);
        res.status(500).send("Error deleting todo");
    } finally {
       if (connection)await connection.close();
    }       
}

