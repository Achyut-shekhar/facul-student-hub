import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useNavigate } from "react-router-dom";

const studentsData = [
    { id: 1, rollNo: "2023001", name: "Aarav Sharma", status: "Pending" },
    { id: 2, rollNo: "2023002", name: "Aditi Singh", status: "Pending" },
    { id: 3, rollNo: "2023003", name: "Arjun Reddy", status: "Pending" },
    { id: 4, rollNo: "2023004", name: "Diya Patel", status: "Pending" },
    { id: 5, rollNo: "2023005", name: "Ishaan Gupta", status: "Pending" },
    { id: 6, rollNo: "2023006", name: "Kavya Mishra", status: "Pending" },
    { id: 7, rollNo: "2023007", name: "Mohammed Khan", status: "Pending" },
    { id: 8, rollNo: "2023008", name: "Neha Verma", status: "Pending" },
    { id: 9, rollNo: "2023009", name: "Rohan Joshi", status: "Pending" },
    { id: 10, rollNo: "2023010", name: "Saanvi Desai", status: "Pending" },
];

const LocationCheck = ({ classId }) => {
  const [students, setStudents] = useState(studentsData);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();
  const { endSession } = useAttendance();
  const navigate = useNavigate();

  const startLocationCheck = () => {
    setIsChecking(true);
    toast({
        title: "Location Check Started",
        description: "Requesting location from students...",
    });

    // Simulate students responding to location check
    setTimeout(() => {
        const updatedStudents = studentsData.map(s => {
            const randomStatus = Math.random();
            if (randomStatus > 0.7) {
                return {...s, status: "Verified"};
            } else if (randomStatus > 0.3) {
                return {...s, status: "Outside Zone"};
            }
            return {...s, status: "Not Responded"};
        });
        setStudents(updatedStudents);
        setIsChecking(false);
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

  const getBadgeVariant = (status) => {
    switch (status) {
        case "Verified":
            return "default";
        case "Outside Zone":
            return "secondary";
        case "Not Responded":
            return "destructive";
        default:
            return "outline";
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Based Attendance</CardTitle>
        <CardDescription>Start a location check to mark attendance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center mb-4">
            <Button onClick={startLocationCheck} disabled={isChecking}>
                {isChecking ? "Checking..." : "Start Location Check"}
            </Button>
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
                    <Badge variant={getBadgeVariant(student.status)}>
                        {student.status}
                    </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={handleEndSession} variant="destructive" className="mt-4">
            End Session
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationCheck;