
const PDFDocument = require('pdfkit'); 
// Create a new resume
// In your backend controller
const Resume = require('../models/Resume');

exports.createResume = async (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    linkedin,
    education,
    skills,
    experience,
    certifications,
    hobbies,
  } = req.body;

  const newResume = new Resume({
    fullName,
    email,
    phoneNumber,
    linkedin,
    education,
    skills,
    experience,
    certifications,
    hobbies,
  });

  await newResume.save();
  res.status(201).json({ message: 'Resume created successfully' });
};

// Get resume by email
exports.getResumeByEmail = async (req, res) => {
  const { email } = req.params;

  const resume = await Resume.findOne({ email });

  if (!resume) {
    return res.status(404).json({ message: 'Resume not found' });
  }

  res.json(resume); // Send resume data or generate PDF as needed
};


// Get all resumes
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resumes', error: error.message });
  }
};



exports.getResumeById = async (req, res) => {
    try {
      const { id } = req.params;
      const resume = await Resume.findById(id);
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      res.status(200).json(resume);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching resume', error: error.message });
    }
  };
  
  exports.generateResumePDF = async (req, res) => {
    try {
      const { email } = req.params;
  
      const resume = await Resume.findOne({ email });
  
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      const doc = new PDFDocument();
  
      const filename = `${resume.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=${filename}`);
  
      doc.pipe(res);
  
      // Styles
      const headerFontSize = 18;
      const sectionTitleFontSize = 14;
      const textFontSize = 10;
  
      const primaryColor = '#2A9D8F'; // Teal for headers
      const secondaryColor = '#264653'; // Darker teal for text
      const borderColor = '#E9C46A'; // Gold for section dividers
  
      // Header
      doc
        .rect(5, 20, 600, 50)
        .fill(primaryColor); // Background for header
      doc
        .fontSize(headerFontSize)
        .font('Helvetica-Bold')
        .fillColor('white')
        .text(resume.fullName.toUpperCase(), 60, 25, { align: 'left' });
  
      doc
        .fontSize(textFontSize)
        .font('Helvetica')
        .fillColor('white')
        .text(`${resume.email} | ${resume.phoneNumber} | ${resume.linkedin || ''}`, 60, 55, { align: 'left' })
    
  
      // Separator Line
      doc
      .moveTo(50, 120)
     
  
  // Work Experience (only display if there is valid data)
// Work Experience (only display if there is valid data)
if (
  Array.isArray(resume.experience) &&
  resume.experience.some(
    (exp) =>
      exp &&
      (exp.jobTitle?.trim() || exp.companyName?.trim() || exp.duration?.trim())
  )
) {
  doc
    .fontSize(sectionTitleFontSize)
    .font('Helvetica-Bold')
    .fillColor(primaryColor)
    .text('WORK EXPERIENCE', 50, 90);

  doc.moveTo(50, doc.y).lineTo(300, doc.y).stroke(borderColor);
  doc.moveDown(0.5);

  resume.experience.forEach((exp) => {
    if (exp.jobTitle?.trim() || exp.companyName?.trim()) {
      doc
        .fontSize(textFontSize)
        .font('Helvetica-Bold')
        .fillColor(secondaryColor)
        .text(`${exp.jobTitle || ''} - ${exp.companyName || ''}`, { align: 'left' });
    }
    if (exp.duration?.trim()) {
      doc
        .font('Helvetica')
        .fillColor('black')
        .text(`${exp.duration}`, { align: 'left' })
        .moveDown(0.5);
    }
  });
} else {
  // No experience: add spacing
  doc.moveDown(2);
}


  
      // Education
      doc
        .fontSize(sectionTitleFontSize)
        .font('Helvetica-Bold')
        .fillColor(primaryColor)
        .text('EDUCATION', { underline: true })
        .moveDown(0.5);
  
      doc
      .moveTo(50, doc.y)
          .lineTo(300, doc.y)
          .stroke(borderColor);
          doc.moveDown(0.5);
  
      doc
        .fontSize(textFontSize)
        .font('Helvetica-Bold')
        .fillColor(secondaryColor)
        .text(`${resume.education.degree} - ${resume.education.institution}`, { align: 'left' })
        .font('Helvetica')
        .fillColor('black')
        .text(`${resume.education.graduationYear} | ${resume.education.location || ''}`, { align: 'left' })
        .moveDown();
  
      // Skills
      if (resume.skills) {
        doc
          .fontSize(sectionTitleFontSize)
          .font('Helvetica-Bold')
          .fillColor(primaryColor)
          .text('SKILLS', { underline: true })
          .moveDown(0.5);
  
        doc
        .moveTo(50, doc.y)
        .lineTo(300, doc.y)
        .stroke(borderColor);
        doc.moveDown(0.5);
        const skillsArray = resume.skills.split(',');
  
        skillsArray.forEach((skill) => {
          doc
            .fontSize(textFontSize)
            .font('Helvetica')
            .fillColor(secondaryColor)
            .text(`• ${skill.trim()}`, { align: 'left' })
            .moveDown(0.3);
        });
      }
  
      // Certifications
      if (resume.certifications) {
        doc
          .fontSize(sectionTitleFontSize)
          .font('Helvetica-Bold')
          .fillColor(primaryColor)
          .text('CERTIFICATIONS', { underline: true })
          .moveDown(0.5);
  
        doc
        .moveTo(50, doc.y)
          .lineTo(300, doc.y)
          .stroke(borderColor);
          doc.moveDown(0.5);
  
        doc
          .fontSize(textFontSize)
          .font('Helvetica')
          .fillColor(secondaryColor)
          .text(`- ${resume.certifications}`, { align: 'left' })
          .moveDown();
      }
  
      // Hobbies
      if (resume.hobbies) {
        doc
          .fontSize(sectionTitleFontSize)
          .font('Helvetica-Bold')
          .fillColor(primaryColor)
          .text('ACTIVITIES', { underline: true })
          .moveDown(0.5);
  
        doc
        .moveTo(50, doc.y)
        .lineTo(300, doc.y)
        .stroke(borderColor);
        doc.moveDown(0.5);
  
        doc
          .fontSize(textFontSize)
          .font('Helvetica')
          .fillColor(secondaryColor)
          .text(`- ${resume.hobbies}`, { align: 'left' })
          .moveDown();
      }
  
      // Finalize PDF
      doc.end();
    } catch (error) {
      res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
  };
  