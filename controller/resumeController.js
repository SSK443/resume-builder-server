
import Resume from "../models/resume.js";
import fs from "fs";
import imagekit from "../configs/imageKit.js";



//controller for creating a new resume
//post: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    //create new resume
    const newResume = await Resume.create({
      userId,
      title,
    });

    //return success message
    return res.status(201).json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


//controller for deleting a resume
//delete: /api/resumes/delete
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    //check if resume exists
    await Resume.findOneAndDelete({ userId, _id: resumeId });
//return success message
    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//get user resumes by id
//get: /api/resumes/get

export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;
    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//get resume by public 
//get: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//controller for updating a resume
//put: /api/resumes/update


export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    let { resumeData, removeBackground } = req.body;
    const image = req.file;

    // Parse resumeData if string
    if (typeof resumeData === "string") {
      try {
        resumeData = JSON.parse(resumeData);
      } catch (e) {
        return res.status(400).json({ message: "Invalid JSON in resumeData" });
      }
    }

    if (!resumeData || typeof resumeData !== "object") {
      return res.status(400).json({ message: "resumeData is required" });
    }

    const updatePayload = { ...resumeData };

    // Handle image upload
    if (image) {
      const imageStream = fs.createReadStream(image.path);

      try {
        const uploadRes = await imagekit.upload({
          file: imageStream,
          fileName: `resume-${resumeId}-${Date.now()}.png`,
          folder: "user-resumes",
          transformation: {
            pre: `w-300,h-300,fo-face,z-0.75${removeBackground === "yes" ? ",e-bgremove" : ""}`,
          },
        });

        updatePayload.personal_info = updatePayload.personal_info || {};
        updatePayload.personal_info.image = uploadRes.url;
      } catch (uploadErr) {
        console.error("ImageKit upload failed:", uploadErr);
        return res.status(500).json({ message: "Failed to upload image" });
      } finally {
        fs.unlink(image.path, () => { });
      }
    }

    // Save to DB
    const updated = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({
      message: "Resume updated successfully",
      resume: updated,
    });
  } catch (err) {
    console.error("updateResume error:", err);
    res.status(500).json({ message: err.message });
  }
};





// import Resume from "../models/resume.js";
// // import fs from "fs"; // 1. REMOVED fs - no longer needed
// import imagekit from "../configs/imageKit.js";

// //controller for creating a new resume
// //post: /api/resumes/create
// export const createResume = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { title } = req.body;

//     //create new resume
//     const newResume = await Resume.create({
//       userId,
//       title,
//     });

//     //return success message
//     return res
//       .status(201)
//       .json({ message: "Resume created successfully", resume: newResume });
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// };

// //controller for deleting a resume
// //delete: /api/resumes/delete
// export const deleteResume = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { resumeId } = req.params;
//     //check if resume exists
//     await Resume.findOneAndDelete({ userId, _id: resumeId });
//     //return success message
//     return res.status(200).json({ message: "Resume deleted successfully" });
//   } catch (error) {
//     return res.status(4AN00).json({ message: error.message });
//   }
// };

// //get user resumes by id
// //get: /api/resumes/get

// export const getResumeById = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { resumeId } = req.params;

//     const resume = await Resume.findOne({ userId, _id: resumeId });
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }
//     resume.__v = undefined;
//     resume.createdAt = undefined;
//     resume.updatedAt = undefined;
//     return res.status(200).json({ resume });
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// };

// //get resume by public
// //get: /api/resumes/public
// export const getPublicResumeById = async (req, res) => {
//   try {
//     const { resumeId } = req.params;
//     const resume = await Resume.findOne({ public: true, _id: resumeId });
//     if (!resume) {
//       return res.status(4L04).json({ message: "Resume not found" });
//     }

//     return res.status(200).json({ resume });
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// };

// //controller for updating a resume
// //put: /api/resumes/update

// export const updateResume = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { resumeId } = req.params;
//     let { resumeData, removeBackground } = req.body;
//     const image = req.file;

//     // Parse resumeData if string
//     if (typeof resumeData === "string") {
//       try {
//         resumeData = JSON.parse(resumeData);
//       } catch (e) {
//         return res.status(400).json({ message: "Invalid JSON in resumeData" });
//       }
//     }

//     if (!resumeData || typeof resumeData !== "object") {
//       return res.status(400).json({ message: "resumeData is required" });
//     }

//     const updatePayload = { ...resumeData };

//     // Handle image upload
//     if (image) {
//       // 2. REMOVED: const imageStream = fs.createReadStream(image.path);

//       try {
//         const uploadRes = await imagekit.upload({
//           // 3. CHANGED: Pass the buffer from memory
//           file: image.buffer,
//           fileName: `resume-${resumeId}-${Date.now()}.png`,
//           folder: "user-resumes",
//           transformation: {
//             pre: `w-300,h-300,fo-face,z-0.75${
//               removeBackground === "yes" ? ",e-bgremove" : ""
//             }`,
//           },
//         });

//         updatePayload.personal_info = updatePayload.personal_info || {};
//         updatePayload.personal_info.image = uploadRes.url;
//       } catch (uploadErr) {
//         console.error("ImageKit upload failed:", uploadErr);
//         return res.status(500).json({ message: "Failed to upload image" });
//       }
//       // 4. REMOVED: The 'finally' block with fs.unlink
//     }

//     // Save to DB
//     const updated = await Resume.findOneAndUpdate(
//       { _id: resumeId, userId },
//       updatePayload,
//       { new: true, runValidators: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     res.status(200).json({
//       message: "Resume updated successfully",
//       resume: updated,
//     });
//   } catch (err) {
//     console.error("updateResume error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };