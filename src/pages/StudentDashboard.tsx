import React, { useState, useEffect } from 'react';
import { Plus, Search, Clock, Users, CheckCircle, AlertTriangle, Code } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface EnrolledClass {
  id: string;
  name: string;
  facultyName: string;
  studentsCount: number;
  nextSession?: string;
  attendanceRate: number;
}

interface ActiveSession {
  id: string;
  className: string;
  facultyName: string;
  startTime: string;
  timeRemaining: string;
  isMarked: boolean;
}

const StudentDashboard: React.FC = () => {
  const { toast } = useToast();
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([
    {
      id: '1',
      name: 'Computer Science 101',
      facultyName: 'Dr. John Smith',
      studentsCount: 45,
      nextSession: '2024-01-16 10:00 AM',
      attendanceRate: 92
    },
    {
      id: '2',
      name: 'Database Systems',
      facultyName: 'Prof. Jane Doe',
      studentsCount: 32,
      nextSession: '2024-01-16 2:00 PM',
      attendanceRate: 88
    }
  ]);

  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
    {
      id: '1',
      className: 'Computer Science 101',
      facultyName: 'Dr. John Smith',
      startTime: '10:00 AM',
      timeRemaining: '25 min',
      isMarked: false
    }
  ]);

  const [joinCode, setJoinCode] = useState('');
  const [attendanceCode, setAttendanceCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ActiveSession | null>(null);

  const handleJoinClass = () => {
    if (!joinCode.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a join code.",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    const newClass: EnrolledClass = {
      id: Date.now().toString(),
      name: 'New Course',
      facultyName: 'Faculty Member',
      studentsCount: 1,
      attendanceRate: 0
    };

    setEnrolledClasses([...enrolledClasses, newClass]);
    setJoinCode('');
    setIsJoinDialogOpen(false);
    
    toast({
      title: "Successfully Joined",
      description: "You have been enrolled in the class."
    });
  };

  const handleMarkAttendance = () => {
    if (!attendanceCode.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter the attendance code.",
        variant: "destructive"
      });
      return;
    }

    if (selectedSession) {
      setActiveSessions(prev =>
        prev.map(session =>
          session.id === selectedSession.id
            ? { ...session, isMarked: true }
            : session
        )
      );

      setAttendanceCode('');
      setIsAttendanceDialogOpen(false);
      setSelectedSession(null);
      
      toast({
        title: "Attendance Marked",
        description: "Your attendance has been recorded successfully."
      });
    }
  };

  const openAttendanceDialog = (session: ActiveSession) => {
    setSelectedSession(session);
    setIsAttendanceDialogOpen(true);
  };

  const filteredClasses = enrolledClasses.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
            <p className="text-muted-foreground mt-1">Your classes and attendance</p>
          </div>
          
          <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Join Class</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join a Class</DialogTitle>
                <DialogDescription>
                  Enter the join code provided by your instructor
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="joinCode">Join Code</Label>
                  <Input
                    id="joinCode"
                    placeholder="e.g., CS101A"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="default" onClick={handleJoinClass}>
                  Join Class
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Sessions Alert */}
        {activeSessions.length > 0 && (
          <Alert className="mb-8 border-l-4 border-l-warning bg-warning/5">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning-foreground">
              <strong>Attendance sessions are active!</strong> Mark your attendance before they expire.
            </AlertDescription>
          </Alert>
        )}

        {/* Active Sessions */}
        {activeSessions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-warning" />
              Active Sessions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSessions.map((session) => (
                <Card key={session.id} className="border-l-4 border-l-warning shadow-medium">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{session.className}</CardTitle>
                      <Badge variant={session.isMarked ? "default" : "secondary"} className={session.isMarked ? "bg-success text-success-foreground" : "bg-warning/20 text-warning-foreground"}>
                        {session.isMarked ? 'MARKED' : 'PENDING'}
                      </Badge>
                    </div>
                    <CardDescription>{session.facultyName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Started:</span>
                      <span>{session.startTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time left:</span>
                      <span className="text-warning font-semibold">{session.timeRemaining}</span>
                    </div>
                    {session.isMarked ? (
                      <div className="flex items-center text-sm text-success">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Attendance marked
                      </div>
                    ) : (
                      <Button
                        variant="premium"
                        size="sm"
                        className="w-full"
                        onClick={() => openAttendanceDialog(session)}
                      >
                        <Code className="h-4 w-4 mr-2" />
                        Mark Attendance
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Enrolled Classes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <Card key={classItem.id} className="shadow-medium hover:shadow-large transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                  <CardDescription>{classItem.facultyName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{classItem.studentsCount} students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${classItem.attendanceRate >= 90 ? 'bg-success' : classItem.attendanceRate >= 70 ? 'bg-warning' : 'bg-destructive'}`} />
                      <span>{classItem.attendanceRate}% attendance</span>
                    </div>
                  </div>
                  
                  {classItem.nextSession && (
                    <p className="text-xs text-muted-foreground">
                      Next: {classItem.nextSession}
                    </p>
                  )}

                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No classes found</p>
            <p className="text-muted-foreground">Join your first class to get started</p>
          </div>
        )}
      </div>

      {/* Attendance Marking Dialog */}
      <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
            <DialogDescription>
              Enter the attendance code displayed by your instructor
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedSession && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedSession.className}</p>
                <p className="text-sm text-muted-foreground">{selectedSession.facultyName}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="attendanceCode">Attendance Code</Label>
              <Input
                id="attendanceCode"
                placeholder="e.g., ATT123"
                value={attendanceCode}
                onChange={(e) => setAttendanceCode(e.target.value.toUpperCase())}
                className="font-mono text-center text-lg"
                maxLength={6}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => {
              setIsAttendanceDialogOpen(false);
              setAttendanceCode('');
              setSelectedSession(null);
            }}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleMarkAttendance}>
              Mark Present
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;