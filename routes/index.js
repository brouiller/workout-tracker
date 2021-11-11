// static route from /exercise to exercise.html
const path = require('path');
const router = require("express").Router();
const Workout = require("../models/workout.js");

router.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/exercise.html'))
})
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
router.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/stats.html'))
})

router.get("/api/workouts/range", ({body}, res) => {
  Workout.aggregate([
    {
        $addFields: {
          totalDuration: {
              $sum: "$exercises.duration"
          }
        }
    }
    ])
    .sort({ day: -1 })
    .limit(7)
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/api/workouts", (req, res) => {
  Workout.aggregate([
      {
          $addFields: {
            totalDuration: {
                $sum: "$exercises.duration"
            }
          }
      }
  ])
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post("/api/workouts", ({ body }, res) => {
  Workout.create(body)
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.put("/api/workouts/:id", (req, res) => {
  Workout.updateOne(
    {
      _id: req.params.id
    },
    {
      $push: {
        exercises: req.body,
      }
    }
  )
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;