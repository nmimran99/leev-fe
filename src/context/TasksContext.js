import React, { createContext, useState } from "react";

export const TasksContext = createContext();

export const TasksContextProvider = (props) => {
	const [tasks, setTasks] = useState([]);

	return (
		<TasksContext.Provider value={{ tasks, setTasks }}>
			{props.children}
		</TasksContext.Provider>
	);
};
