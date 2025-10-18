const express = require("express");
const path = require("path")
const cors = require("cors")
const oracledb = require("oracledb");

const app = express();
app.use(cors());
app.use(express.json()); // 👈 Needed to parse JSON bodies
app.use(express.static('.')); // Serve index.html if needed

app.use(express.static(path.join(__dirname, 'public')))

const dbConfig ={
    user: "demonode",
    password: "1234",
    connectString: "localhost/FREEPDB1",
};

//Get all Todos
app.get("/todos", async (req, res) =>{
    let connection;
    try{
        connection = await oracledb.getConnection(dbConfig);
        const result= await connection.execute(
            "SELECT id, description, done FROM  todoitem  ORDER BY id",
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT}
        );
        res.json(result.rows)
    } catch (err){
        console.error(err);
        res.status(500).send("Error fetching todos")
    } finally{
        if (connection)await connection.close();
    }
})

app.post("/todos", async (req, res) => {
    console.log("Received body:", req.body);
    let connection;
    const { description } = req.body;
    try{
        connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
            "INSERT INTO todoitem(description, done) VALUES (:1, 0)",
            [description]
        );
        await connection.commit();
        res.send("Todo added successfully")
    } catch(err){
        console.error(err);
        res.status(500).send("Error adding todo");
    } finally {
       if (connection) await connection.close();
    }

});
//update todo
app.put("/todos/:id", async (req, res)=>{
    let connection;
    const { id } = req.params;
    const { done } = req.body;
    try{
        connection = await oracledb.getConnection(dbConfig);
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
})

//delete todo
app.delete("/todos/:id", async (req, res)=>{
    let connection;
    const { id } = req.params;
    try{
        connection = await oracledb.getConnection(dbConfig);
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
})
const PORT =4000;
app.listen(PORT, () => console.log(`Server running on  http://localhost:${PORT}`))