import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const studentsData = [
    { id: 1, rollNo: "2023001", name: "Aarav Sharma", status: "Absent" },
    { id: 2, rollNo: "2023002", name: "Aditi Singh", status: "Absent" },
    { id: 3, rollNo: "2023003", name: "Arjun Reddy", status: "Absent" },
    { id: 4, rollNo: "2023004", name: "Diya Patel", status: "Absent" },
    { id: 5, rollNo: "2023005", name: "Ishaan Gupta", status: "Absent" },
    { id: 6, rollNo: "2023006", name: "Kavya Mishra", status: "Absent" },
    { id: 7, rollNo: "2023007", name: "Mohammed Khan", status: "Absent" },
    { id: 8, rollNo: "2023008", name: "Neha Verma", status: "Absent" },
    { id: 9, rollNo: "2023009", name: "Rohan Joshi", status: "Absent" },
    { id: 10, rollNo: "2023010", name: "Saanvi Desai", status: "Absent" },
];

const CodeGeneration = ({ classId }) => {
  const [code, setCode] = useState("");
  const [students, setStudents] = useState(studentsData);
  const [isGenerating, setIsGenerating] = useState(false);
  const { endSession } = useAttendance();
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateCode = () => {
    setIsGenerating(true);
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCode(randomCode);
    // Simulate students marking attendance
    setTimeout(() => {
        const updatedStudents = studentsData.map(s => {
            if (Math.random() > 0.5) {
                return {...s, status: "Present"};
            }
            return s;
        });
        setStudents(updatedStudents);
        setIsGenerating(false);
    }, 3000);
  };

  const handleEndSession = () => {
    toast({
      title: "Session Ended",
      description: "The attendance session has been closed.",
    });
    endSession(classId);
    navigate('/faculty-dashboard');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Code Generation Attendance</CardTitle>
        <CardDescription>Generate a code for students to mark their attendance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center mb-4">
            <Button onClick={generateCode} disabled={isGenerating || code}>
                {isGenerating ? "Generating..." : "Generate Code"}
            </Button>
            {code && <p className="text-2xl font-bold tracking-widest">{code}</p>}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.rollNo}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell className="text-right">
                    <Badge variant={student.status === 'Present' ? 'default' : 'destructive'}>
                        {student.status}
                    </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {code && (
          <Button onClick={handleEndSession} variant="destructive" className="mt-4">
            End Session
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeGeneration;