const { trace } = require("console");
const express = require("express");
const fs = require("fs");
const app = express();
const port = 3012;

app.use(express.json());

// GET - Read and return data
app.get('/', (req, res) => {
    fs.readFile("file.json", "utf-8", (err, data) => {
        if (err) {
            console.log("Read error:", err);
            return res.status(404).send("File not found");
        }
        try {
            const parsedData = JSON.parse(data);
            res.json(parsedData);
        } catch (e) {
            console.log("Parse error:", e);
            res.status(500).send("Error parsing data");
        }
    });
});

// POST - Add a new task
app.post('/save', (req, res) => {
    const { task } = req.body;

    if (!task) {
        return res.status(400).send("task is required");
    }


    fs.readFile("file.json", "utf-8", (err, data) => {
        let tasks = [];

        if (!err && data) {
            try {
                tasks = JSON.parse(data);
            } catch (e) {
                console.log("Parse error:", e);
            }
        }

        const maxId = tasks.length ? Math.max(...tasks.map(task => task.id)) : 0;
        const newTask = {
            id: maxId + 1,
            "task name": task
        };

        tasks.push(newTask);

        fs.writeFile("file.json", JSON.stringify(tasks, null, 2), "utf-8", (err) => {
            if (err) {
                console.log("Write error:", err);
                return res.status(500).send("Failed to save data");
            }
            res.send("Data saved");
        });
    });

});

app.delete('/delete', (req, res) => {
    const id = req.body.id;
    if (!id) {
        return res.status(400).send("id is required");
    }
    fs.readFile("file.json", "utf-8", (err, data) => {
        if (err) {
            console.log("its error", err);
            return res.status(500).send("failed to search");
        }
        let tasks;
        try {
            tasks = JSON.parse(data);

        } catch (error) {
            console.log("its error", error);
            return res.status(500).send("failed to search");
        }

        const filtereedtasks = tasks.filter(task => task.id !== Number(id));

        if (filtereedtasks.length === tasks.length) {
            return res.status(404).send("Task not found");
        }

        fs.writeFile("file.json", JSON.stringify(filtereedtasks, null, 2), "utf-8", (err) => {
            if (err) {
                console.log("its error", err);
                return res.status(500).send("failed to search");
            }
            res.send("sucess");

        })

    })

})



app.put('/update', (req, res) => {
    const id = req.body.id;
    if (!id) {
        console.log("wrong id");
        res.status(404).send("id not found");
    }
    fs.readFile("file.json", "utf-8", (err, data) => {
        if (err) {
            console.log("error", err);
            res.status(500).send("failed operation");
        }
        let tasks;
        try {
            tasks = JSON.parse(data);


        } catch (error) {
            console.log("error", error);
            res.status(500).send("failed operation");

        }
        const updatetask {


        }
        const filtertask = tasks.filter(task => task.id !== Number(id));
        if (filtertask.length == tasks.length) {
            return res.status(404).send("Task not found");
        }
        fs.writeFile("file.json", JSON.stringify(filtertask, null, 2), "utf-8", (err) => {
            if (err) {
                console.log("its error", err);
                return res.status(500).send("failed to search");
            }
            res.send("sucess");
        })



    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});