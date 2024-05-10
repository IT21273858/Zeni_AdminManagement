var express = require('express');

const router = express.Router();
const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient();


// Allow courses

router.route('/admin/verify/:id').patch((req, res) => {
    const _id = req.params.id
    const courseData = {
        visibility: req.body.visibility,
    };

    try {
        prisma.course.update({
            where: {
                id: _id
            },
            data: courseData
        }).then((data) => {
            if (data) {
                res.status(200).json({ status: true, message: `Course Visibility - ${data.visibility}`, data: data, code: "200" })
            }
            else {
                res.status(404).json({ status: false, message: "Course not found", code: "404" })
            }
        })
    } catch (error) {
        res.status(500).json({ status: false, message: "Error occured while updating Course visibility", code: "500" })
    }
});


// Admin find Users

router.route('/admin/users').get((req, res) => {

    try {
        prisma.user.findMany().then((Users) => {
            if (Users) {
                var instructor = 0;
                var learner = 0;
                Users.map((user) => {
                    if (user.Role == "Instructor") {
                        instructor += 1;
                    }
                    if (user.Role == "Learner") {
                        learner += 1
                    }
                })
                const usercount = {
                    instructor_count: instructor,
                    learner_count: learner
                }
                res.status(200).json({ status: true, message: "Users retreived", usercount: usercount, code: "200" })
            }
            else {
                res.status(404).json({ status: true, message: "No data retreived while fetching", code: "404" })
            }
        })
    }
    catch (error) {
        console.error("Error occured", error);
        res.status(500).json({ status: false, message: "Internl Server Error", code: "500" })
    }
})




// // Get All Courses
// router.route('/course/getAll').get((req, res) => {
//     try {
//         prisma.course.findMany({
//             include: {
//                 module: {
//                     include: {
//                         resources: true
//                     }
//                 },
//                 feedback: true,
//                 payment: true,
//                 enrollment: true
//             }
//         }).then((data) => {
//             res.status(200)
//                 .json({ status: true, message: "Courses retrieved successful", data, code: "200" });
//         })

//     } catch (error) {
//         console.error("Error finding courses:", error);
//         res.status(500).json({ status: false, message: "Internal Server Error", code: 500 });
//     }
// })




// // Function to retreive enrollment informations
// router.route('/instructor/enrollment/get/:id').get((req, res) => {
//     try {
//         prisma.course.findMany({
//             where: {
//                 c_InstructorId: req.params.id
//             },
//             include: {
//                 feedback: true
//             }
//         }).then(async (courses) => {
//             if (courses.length === 0) {
//                 return res.status(404).json({ status: false, message: "No courses found for the specified instructor", code: 404 });
//             }

//             const enrollmentPromises = courses.map(async (course) => {
//                 const enrollment = await prisma.enrollment.findMany({
//                     where: {
//                         courseId: course.id
//                     },
//                     include: {
//                         course: true,
//                         user: true
//                     }
//                 });
//                 return enrollment;
//             });

//             Promise.all(enrollmentPromises).then((enrollmentArrays) => {
//                 const allEnrollments = enrollmentArrays.flat();
//                 res.status(200).json({ status: true, message: "Enrollments retrieved successfully", data: allEnrollments, count: allEnrollments.length, code: 200 });
//             }).catch((error) => {
//                 console.error("Error finding enrollment:", error);
//                 res.status(500).json({ status: false, message: "Internal Server Error", code: 500 });
//             });
//         });
//     } catch (error) {
//         console.error("Error finding enrollments:", error);
//         res.status(500).json({ status: false, message: "Internal Server Error", code: 500 });
//     }
// });



// Delete the course
router.route('/course/delete/:id').delete((req, res) => {
    const _id = req.params.id

    try {

        prisma.course.delete({
            where: {
                id: _id,
            },
        }).then((data) => {
            if (data) {
                res.status(200).json({ status: true, message: "Course deleted", code: "200" })
            } else {
                res.status(404).json({ status: false, message: "Course not found", code: "404" });
            }
        });

    } catch (error) {
        res.status(500).json({ status: false, message: "Error while deleting course", code: "500" });
        console.log("Error while deleting course", error);
    }
});
module.exports = router;