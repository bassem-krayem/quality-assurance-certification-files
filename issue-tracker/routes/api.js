"use strict";
const { v4: uuidv4 } = require("uuid");
const { response } = require("../server");

module.exports = function (app) {
  const projects = {};

  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      const issues = projects[project];
      if (req.query) {
        const query = req.query;
        const filteredIssues = issues.filter((issue) =>
          Object.keys(query).every((key) => issue[key] === query[key])
        );
        res.json(filteredIssues);
      }

      res.json(issues);
    })

    .post(function (req, res) {
      let project = req.params.project;
      let issue = req.body;

      if (!issue.issue_title || !issue.issue_text || !issue.created_by) {
        res.send({ error: "required field(s) missing" });
        return;
      }

      if (projects[project] === undefined) {
        projects[project] = [];
      }

      issue.assigned_to = issue.assigned_to || "";
      issue.status_text = issue.status_text || "";

      issue._id = uuidv4();
      issue.created_on = new Date();
      issue.updated_on = new Date();
      issue.open = true;

      projects[project].push(issue);

      res.status(201).json(issue);
    })

    .put(function (req, res) {
      let project = req.params.project;
      const { _id, ...fieldsTOUpdate } = req.body;
      // console.log(req.body);
      const issues = projects[project];
      let issueToUpdate = issues.find((el) => el._id === _id);

      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      const updateKeys = Object.keys(fieldsTOUpdate).filter(
        (key) => fieldsTOUpdate[key] !== undefined && fieldsTOUpdate[key] !== ""
      );

      if (updateKeys.length === 0) {
        return res.json({ error: "no update field(s) sent", _id });
      }

      if (!issueToUpdate) {
        return res.json({ error: "could not update", _id: _id });
      }

      for (let key in fieldsTOUpdate) {
        if (issueToUpdate.hasOwnProperty(key)) {
          issueToUpdate[key] = fieldsTOUpdate[key];
        }
      }
      issueToUpdate.updated_on = new Date();

      res.json({
        result: "successfully updated",
        _id: _id,
      });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      const issues = projects[project];
      if (!issues) {
        return res.json({ error: "could not delete", _id });
      }

      const index = issues.findIndex((issue) => issue._id === _id);

      if (index === -1) {
        return res.json({ error: "could not delete", _id });
      }

      issues.splice(index, 1);

      res.json({ result: "successfully deleted", _id });
    });
};
