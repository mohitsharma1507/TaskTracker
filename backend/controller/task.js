const Task = require("../model/task");
const Project = require("../model/project");

module.exports.CreateTask = async (req, res) => {
  try {
    const { title, description, status, projectId } = req.body;

    const project = await Project.findOne({
      _id: projectId,
      user: req.user._id,
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const task = new Task({ title, description, status, project: projectId });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.GetAllTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({
      _id: projectId,
      user: req.user._id,
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const tasks = await Task.find({ project: projectId });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.UpdateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findById(taskId).populate("project");
    if (!task || String(task.project.user) !== String(req.user._id)) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;

    if (status === "Completed") {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.DeleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("project");
    if (!task || String(task.project.user) !== String(req.user._id)) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
