import React, { useState } from 'react';
import { Bell, X, Check, Clock, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: 'attendance_session' | 'class_joined' | 'attendance_marked' | 'session_ended';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'attendance_session',
      title: 'New Attendance Session',
      message: 'Computer Science 101 attendance session is now active. Code: ATT123',
      timestamp: '2 minutes ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'class_joined',
      title: 'Student Joined Class',
      message: 'John Doe has joined your Database Systems class',
      timestamp: '1 hour ago',
      isRead: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'attendance_marked',
      title: 'Attendance Recorded',
      message: 'Your attendance has been marked for Computer Science 101',
      timestamp: '2 hours ago',
      isRead: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'session_ended',
      title: 'Session Ended',
      message: 'Database Systems attendance session has ended. 28/32 students present.',
      timestamp: '3 hours ago',
      isRead: true,
      priority: 'medium'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'attendance_session':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'class_joined':
        return <Users className="h-4 w-4 text-primary" />;
      case 'attendance_marked':
        return <Check className="h-4 w-4 text-success" />;
      case 'session_ended':
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-destructive';
      case 'medium':
        return 'border-l-warning';
      case 'low':
        return 'border-l-muted';
      default:
        return 'border-l-muted';
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
          <SheetDescription>
            Stay updated with your classes and attendance
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-full mt-6">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`cursor-pointer transition-all duration-200 border-l-4 ${getPriorityColor(notification.priority)} ${
                    notification.isRead ? 'opacity-60' : 'shadow-medium hover:shadow-large'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getNotificationIcon(notification.type)}
                        <CardTitle className="text-sm font-medium">
                          {notification.title}
                        </CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <div className="h-2 w-2 bg-primary rounded-full" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotifications(prev => prev.filter(n => n.id !== notification.id));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs mb-2">
                      {notification.message}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground">
                      {notification.timestamp}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;