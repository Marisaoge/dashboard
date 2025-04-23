import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Question {
  id: number;
  question: string;
  answer: string;
  score?: number;
}

export const generateAssessmentPDF = (
  title: string,
  createdBy: string,
  dateCompleted: string,
  questions: Question[]
) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  // Add metadata
  doc.setFontSize(12);
  doc.text(`Created by: ${createdBy}`, 20, 30);
  doc.text(`Date completed: ${dateCompleted}`, 20, 40);
  
  // Add questions and answers
  const tableData = questions.map(q => [
    `${q.id}. ${q.question}`,
    q.answer + (q.score !== undefined ? ` [${q.score}]` : '')
  ]);
  
  doc.autoTable({
    startY: 50,
    head: [['Question', 'Answer']],
    body: tableData,
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 60 }
    },
    margin: { left: 20 }
  });
  
  // Save the PDF
  doc.save(`${title.replace(/\s+/g, '_')}_${dateCompleted.replace(/\//g, '-')}.pdf`);
}; 