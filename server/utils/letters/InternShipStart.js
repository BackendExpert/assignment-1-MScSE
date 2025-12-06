const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const createInternShipStartLetter = async ({ date, name, startdate, enddate, superviosrname }) => {
    try {
        // Create PDF
        const doc = new PDFDocument({ margin: 50 });
        const filename = `letter_${name}.pdf`;

        // ✅ Save only to file (no res headers)
        const folderPath = path.join(process.cwd(), "uploads"); // note plural 'uploads'
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        const savePath = path.join(folderPath, filename);
        const fileStream = fs.createWriteStream(savePath);

        doc.pipe(fileStream);

        // Logos
        const logoLeft = path.join(process.cwd(), "assets", "uoplogo.png");
        const logoRight = path.join(process.cwd(), "assets", "ceitlogo.png");

        doc.image(logoLeft, 50, 40, { width: 80 });
        doc.image(logoRight, 450, 40, { width: 80 });

        // Header
        doc.fontSize(16)
            .text("Information Technology Center", 0, 70, { align: "center" })
            .text("University of Peradeniya", { align: "center" })
            .moveDown(2);

        // Date
        doc.fontSize(12).text(`Date: ${date}`, 40, 160, { align: "left" }).moveDown(2);

        // Title
        doc.fontSize(14).text("Internship/Training Commencement Letter", {
            align: "left",
            underline: true,
        }).moveDown(1);

        // Body
        doc.font("Helvetica-Bold").fontSize(12).text(`Dear ${name},\n`).moveDown(0.5);

        doc.font("Helvetica").text(
            "We are pleased to inform you that you have been selected to undergo your internship/training program at the Information and Communication Technology (ICT) Center, University of Peradeniya.",
            { lineGap: 2 }
        ).moveDown(1);

        // Details
        doc.font("Helvetica-Bold").text("Internship/Training Details:", { underline: true }).moveDown(0.5);
        doc.font("Helvetica");
        [
            `Intern Name: ${name}`,
            `Department: ICT Center`,
            `Duration: ${startdate} – ${enddate}`,
            `Supervisor: ${superviosrname}`,
            "Working Hours: 8:00 AM – 4:00 PM, Monday to Friday"
        ].forEach(item => doc.text("• " + item, { indent: 20 }));

        doc.moveDown(1);

        doc.text(
            "During your training, you will be assigned to various projects and tasks related to ICT operations, system administration, software development, and technical support under the guidance of our team.",
            { lineGap: 2 }
        ).moveDown(1);

        doc.text(
            "Please report to the ICT Center, University of Peradeniya, at 8:00 AM on your start date to commence your training. Kindly bring a copy of this letter and your student identification card on your first day.",
            { lineGap: 2 }
        ).moveDown(1);

        doc.text(
            "We wish you a fruitful and successful training period. Should you require any assistance, feel free to contact the ICT Center administration.",
            { lineGap: 2 }
        ).moveDown(3);

        // Signature
        doc.text("Yours sincerely,", { lineGap: 2 }).moveDown(2);
        doc.text("Dr. Upul Jayasinghe");
        doc.text("Director");
        doc.text("ICT Center");
        doc.text("University of Peradeniya");

        doc.end();

        return new Promise((resolve, reject) => {
            fileStream.on("finish", () => {
                // Return only the filename for DB/frontend
                resolve(filename);
            });
            fileStream.on("error", reject);
        });

    } catch (error) {
        console.error("Letter Service Error:", error);
        throw error;
    }
};

module.exports = { createInternShipStartLetter };
