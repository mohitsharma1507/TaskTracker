const Project = require("../model/project");

module.exports.CreateProject = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user._id;

  const count = await Project.countDocuments({ user: userId });
  if (count >= 4) {
    return res
      .status(400)
      .json({ error: "Maximum 4 projects allowed per user" });
  }

  const project = new Project({ title, description, userId });
  await project.save();
  res.status(201).json(project);
};

module.exports.GetAllProject = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id });
    res.json({ status: true, data: projects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch projects" });
  }
};
