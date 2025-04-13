
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description: string;
    goal: number;
    raised: number;
    is_active: boolean;
    main_image?: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const percentRaised = Math.min(Math.round((project.raised / project.goal) * 100), 100);
  const formattedRaised = project.raised.toLocaleString('ar-EG');
  const formattedGoal = project.goal.toLocaleString('ar-EG');
  
  // Prepare a short description (first 100 characters)
  const shortDescription = project.description.length > 100 
    ? project.description.substring(0, 100) + '...'
    : project.description;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={project.main_image || "https://images.unsplash.com/photo-1469571486292-b5051fe9f386"} 
          alt={project.title}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
        {project.is_active && (
          <div className="absolute top-2 left-2 bg-gaza-primary text-white text-xs px-2 py-1 rounded-full">
            مشروع نشط
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <CardDescription>{shortDescription}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span>تم جمع: {formattedRaised} $</span>
            <span>الهدف: {formattedGoal} $</span>
          </div>
          <Progress value={percentRaised} className="h-2" />
          <div className="text-sm text-muted-foreground text-left">
            {percentRaised}%
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" asChild>
          <Link to={`/projects/${project.id}`}>تفاصيل المشروع</Link>
        </Button>
        <Button className="bg-gaza-primary hover:bg-gaza-primary/90">
          تبرع الآن
        </Button>
      </CardFooter>
    </Card>
  );
}
