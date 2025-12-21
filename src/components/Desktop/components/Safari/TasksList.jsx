import TaskCard from "./TaskCard";

const TaskList = ({ tasks, onSelectTask }) => (
  <div className="grid mb-20 grid-cols-1 lg:grid-cols-2 gap-6">
    {tasks.map((task) => (
      <TaskCard 
        key={task.id} 
        task={task} 
        onClick={() => onSelectTask(task)}
      />
    ))}
  </div>
);

export default TaskList;