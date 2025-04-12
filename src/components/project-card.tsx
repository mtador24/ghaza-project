
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Project } from "@/data/mockData";
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
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const percentRaised = Math.min(Math.round((project.raised / project.goal) * 100), 100);
  const formattedRaised = project.raised.toLocaleString('ar-EG');
  const formattedGoal = project.goal.toLocaleString('ar-EG');
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={project.images[0]?.url || "https://images.unsplash.com/photo-1469571486292-b5051fe9f386"} 
          alt={project.images[0]?.alt || project.title}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
        {project.isActive && (
          <div className="absolute top-2 left-2 bg-gaza-primary text-white text-xs px-2 py-1 rounded-full">
            مشروع نشط
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <CardDescription>{project.shortDescription}</CardDescription>
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
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>عدد المتبرعين: {project.donors.length}</p>
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
