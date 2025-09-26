import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, Play, Square, Filter, Search, Clock, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const FacultyDashboard = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState([
    {
      id: '1',
      name: 'Computer Science 101',
      joinCode: 'CS101A',
      studentsCount: 45,
      sessionsCount: 12,
      lastSession: '2024-01-15'
    },
    {
      id: '2',
      name: 'Database Systems',
      joinCode: 'DB301B',
      studentsCount: 32,
      sessionsCount: 8,
      lastSession: '2024-01-14'
    }
  ]);

  const [activeSessions, setActiveSessions] = useState([
    {
      id: '1',
      className: 'Computer Science 101',
      startTime: '10:00 AM',
      attendanceCode: 'ATT123',
      presentCount: 32,
      totalStudents: 45,
      status: 'ACTIVE'
    }
  ]);

  const [newClass, setNewClass] = useState({ name: '', joinCode: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateClass = () => {
    if (!newClass.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a class name.",
        variant: "destructive"
      });
      return;
    }

    const generatedCode = newClass.joinCode || `CL${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const createdClass = {
      id: Date.now().toString(),
      name: newClass.name,
      joinCode: generatedCode,
      studentsCount: 0,
      sessionsCount: 0
    };

    setClasses([...classes, createdClass]);
    setNewClass({ name: '', joinCode: '' });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Class Created",
      description: `${newClass.name} has been created successfully.`
    });
  };

  const startAttendanceSession = (classItem) => {
    const attendanceCode = `ATT${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    
    const newSession = {
      id: Date.now().toString(),
      className: classItem.name,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attendanceCode,
      presentCount: 0,
      totalStudents: classItem.studentsCount,
      status: 'ACTIVE'
    };

    setActiveSessions([...activeSessions, newSession]);
    
    toast({
      title: "Attendance Session Started",
      description: `Code: ${attendanceCode} for ${classItem.name}`
    });
  };

  const endAttendanceSession = (sessionId) => {
    setActiveSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, status: 'ENDED', endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : session
      )
    );
    
    toast({
      title: "Session Ended",
      description: "Attendance session has been ended successfully."
    });
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Faculty Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your classes and attendance sessions</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Class</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
                <DialogDescription>
                  Add a new class to your dashboard
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="className">Class Name</Label>
                  <Input
                    id="className"
                    placeholder="e.g., Computer Science 101"
                    value={newClass.name}
                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinCode">Join Code (Optional)</Label>
                  <Input
                    id="joinCode"
                    placeholder="Leave empty to auto-generate"
                    value={newClass.joinCode}
                    onChange={(e) => setNewClass({ ...newClass, joinCode: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="default" onClick={handleCreateClass}>
                  Create Class
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Sessions */}
        {activeSessions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-success" />
              Active Sessions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSessions.map((session) => (
                <Card key={session.id} className="border-l-4 border-l-success shadow-medium">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{session.className}</CardTitle>
                      <Badge variant="outline" className="bg-success/10 text-success border-success">
                        LIVE
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Code:</span>
                      <span className="font-mono font-bold text-primary">{session.attendanceCode}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Started:</span>
                      <span>{session.startTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Present:</span>
                      <span className="text-success font-semibold">
                        {session.presentCount}/{session.totalStudents}
                      </span>
                    </div>
                    {session.status === 'ACTIVE' ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => endAttendanceSession(session.id)}
                      >
                        <Square className="h-4 w-4 mr-2" />
                        End Session
                      </Button>
                    ) : (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 mr-2 text-success" />
                        Ended at {session.endTime}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <Card key={classItem.id} className="shadow-medium hover:shadow-large transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <CardDescription className="font-mono">
                      Code: {classItem.joinCode}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{classItem.studentsCount} students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{classItem.sessionsCount} sessions</span>
                  </div>
                </div>
                
                {classItem.lastSession && (
                  <p className="text-xs text-muted-foreground">
                    Last session: {classItem.lastSession}
                  </p>
                )}

                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => startAttendanceSession(classItem)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No classes found</p>
            <p className="text-muted-foreground">Create your first class to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;