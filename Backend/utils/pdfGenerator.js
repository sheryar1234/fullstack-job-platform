const PDFDocument = require('pdfkit');

const generateResumePDF = (resume, res) => {
  const doc = new PDFDocument();
  const filename = `${resume.fullName.replace(/\s+/g, '_')}_Resume.pdf`;

  // Set response headers for PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

  // Pipe the PDF document directly to the response
  doc.pipe(res);

  // Generate PDF content
  doc.fontSize(16).text(resume.fullName || '', { align: 'center' });
  doc.moveDown(0.5);
  
  // Contact Information
  doc.fontSize(12).text('Contact Information', { align: 'left', underline: true });
  doc.fontSize(10).text(`Email: ${resume.email || ''}`);
  doc.text(`Phone: ${resume.phoneNumber || ''}`);
  if (resume.linkedin) doc.text(`LinkedIn: ${resume.linkedin}`);
  doc.moveDown();

  // Education
  const education = resume.education || {};
  doc.fontSize(12).text('Education', { align: 'left', underline: true });
  if (education.degree || education.institution) {
    doc.fontSize(10).text(`${education.degree || ''}${education.degree && education.institution ? ' from ' : ''}${education.institution || ''}`);
    if (education.graduationYear) doc.text(`Graduation Year: ${education.graduationYear}`);
    if (education.CGPA) doc.text(`CGPA: ${education.CGPA}`);
  } else {
    doc.fontSize(10).text('No education information provided');
  }
  doc.moveDown();

  // Skills
  if (resume.skills) {
    doc.fontSize(12).text('Skills', { align: 'left', underline: true });
    doc.fontSize(10).text(resume.skills);
    doc.moveDown();
  }

  // Work Experience (only if exists)
// Work Experience (only if at least one entry has data)
// Work Experience (only if at least one entry has meaningful data)
if (
  Array.isArray(resume.experience) &&
  resume.experience.some(
    exp =>
      exp &&
      (exp.companyName?.trim() || exp.jobTitle?.trim() || exp.duration?.trim())
  )
) {
  doc.fontSize(12).text('Work Experience', { align: 'left', underline: true });
  resume.experience.forEach((exp, index) => {
    if (exp.companyName?.trim() || exp.jobTitle?.trim()) {
      doc.fontSize(10).text(
        `${exp.jobTitle || ''}${exp.jobTitle && exp.companyName ? ' at ' : ''}${exp.companyName || ''}`
      );
      if (exp.duration) doc.text(`Duration: ${exp.duration}`);
      if (index < resume.experience.length - 1) doc.moveDown(0.5);
    }
  });
  doc.moveDown();
}



  // Certifications
  if (resume.certifications) {
    doc.fontSize(12).text('Certifications', { align: 'left', underline: true });
    doc.fontSize(10).text(resume.certifications);
    doc.moveDown();
  }

  // Hobbies
  if (resume.hobbies) {
    doc.fontSize(12).text('Hobbies', { align: 'left', underline: true });
    doc.fontSize(10).text(resume.hobbies);
  }

  // Finalize the PDF document
  doc.end();
};


module.exports = { generateResumePDF };
