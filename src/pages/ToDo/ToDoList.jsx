import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import styles from "./ToDoList.module.css";
import {
  Button,
  Divider,
  Empty,
  Input,
  Modal,
  Select,
  Tag,
  Tooltip,
  message,
} from "antd";
import { getErrorMessage } from "../../util/GetError";
import { getUserDetails } from "../../util/GetUser";
import ToDoServices from "../../services/toDoServices";
import { useNavigate } from "react-router";
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

// Function to format the date
const getFormattedDate = (dateString = new Date()) => {
    const parsedDate = new Date(dateString);
  
    // Check if parsedDate is a valid date
    if (isNaN(parsedDate)) {
      return "Invalid Date"; // Return a fallback in case of invalid date
    }
  
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Set to true if you want a 12-hour format
    };
  
    return parsedDate.toLocaleString(undefined, options);
  };
  
  

function ToDoList() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allToDo, setAllToDo] = useState([]);
  const [currentEditItem, setCurrentEditItem] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState(false);
  const [currentTaskType, setCurrentTaskType] = useState("incomplete");
  const [filteredToDo, setFilteredToDo] = useState([]);

  const navigate = useNavigate();

  const getAllToDo = async () => {
    try {
      let user = getUserDetails();
      const response = await ToDoServices.getAllToDo(user.userId);
      setAllToDo(response.data);
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  useEffect(() => {
    let user = getUserDetails();
    if (user && user.userId) {
      getAllToDo();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    // Update tasks based on the currentTaskType
    const filteredTasks = allToDo.filter((item) => {
      if (currentTaskType === "incomplete") return !item.iscompleted;
      return item.iscompleted;
    });

    setFilteredToDo(filteredTasks);
  }, [allToDo, currentTaskType]);

  const handleSubmitTask = async () => {
    setLoading(true);
    try {
      const userId = getUserDetails().userId;
      const data = {
        title,
        description,
        iscompleted: false,
        createdBy: userId,
        createdAt: getFormattedDate().toString()  // Ensure you're passing a proper date format
    };
      console.log(getFormattedDate())
      await ToDoServices.createToDo(data);
      setLoading(false);
      message.success("To Do Task Added Successfully!");
      setIsAdding(false);
      getAllToDo();
      setTitle("");
      setDescription("");
    } catch (err) {
      setLoading(false);
      message.error(getErrorMessage(err));
    }
  };

  const handleEdit = (item) => {
    setCurrentEditItem(item);
    setUpdatedTitle(item.title);
    setUpdatedDescription(item.description);
    setUpdatedStatus(item.iscompleted); // Ensure this gets the correct value
    setIsEditing(true);
  };

  const handleDelete = async (item) => {
    try {
      await ToDoServices.deleteToDo(item.id);
      message.success(`${item.title} is Deleted Successfully!`);
      getAllToDo();
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await ToDoServices.updateToDo(id, { iscompleted: status });
      message.success("Task Status Updated Successfully!");
      getAllToDo();
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  const handleUpdateTask = async () => {
    setLoading(true);
    try {
      const data = {
        title: updatedTitle,
        description: updatedDescription,
        iscompleted: updatedStatus, // Ensure updated status is sent
        updatedat:getFormattedDate().toString()
      };
      await ToDoServices.updateToDo(currentEditItem.id, data);
      message.success(`${currentEditItem.title} Updated Successfully!`);
      setLoading(false);
      setIsEditing(false);
      getAllToDo();
    } catch (err) {
      setLoading(false);
      message.error(getErrorMessage(err));
    }
  };

  const handleTypeChange = (value) => {
    setCurrentTaskType(value);
  };

  const handleSearch = (e) => {
    let query = e.target.value.toLowerCase();
    let filteredList = allToDo.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
    setFilteredToDo(filteredList.length > 0 ? filteredList : []);
  };

  const taskListToDisplay =
    filteredToDo.length > 0
      ? filteredToDo
      : allToDo.filter((item) =>
          currentTaskType === "incomplete"
            ? !item.iscompleted
            : item.iscompleted
        );

  return (
    <>
      <Navbar active={"myTask"} />
      <section className={styles.toDoWrapper}>
        <div className={styles.toDoHeader}>
          <h2>Your Tasks</h2>
          <Input
            style={{ width: "50%" }}
            onChange={handleSearch}
            placeholder="Search Your Task Here..."
          />
          <div>
            <Button
              onClick={() => setIsAdding(true)}
              type="primary"
              size="large"
            >
              Add Task
            </Button>
            <Select
              value={currentTaskType}
              style={{ width: 180, marginLeft: "10px" }}
              onChange={handleTypeChange}
              size="large"
              options={[
                { value: "incomplete", label: "Incomplete" },
                { value: "complete", label: "Complete" },
              ]}
            />
          </div>
        </div>
        <Divider />

        <div className={styles.toDoListCardWrapper}>
          {taskListToDisplay.length > 0 ? (
            taskListToDisplay.map((item) => (
              <div key={item.id} className={styles.toDoCard}>
                <div>
                  <div className={styles.toDoCardHeader}>
                    <h3>{item.title}</h3>
                    {item.iscompleted ? (
                      <Tag color="cyan">Completed</Tag>
                    ) : (
                      <Tag color="red">Incomplete</Tag>
                    )}
                  </div>
                  <p>{item.description}</p>
                </div>

                <div className={styles.toDoCardFooter}>
                  <Tag>{getFormattedDate()}</Tag>
                  <div className={styles.toDoFooterAction}>
                    <Tooltip title="Edit Task?">
                      <EditOutlined
                        onClick={() => handleEdit(item)}
                        className={styles.actionIcon}
                      />
                    </Tooltip>
                    <Tooltip title="Delete Task?">
                      <DeleteOutlined
                        onClick={() => handleDelete(item)}
                        style={{ color: "red" }}
                        className={styles.actionIcon}
                      />
                    </Tooltip>
                    {item.iscompleted ? (
                      <Tooltip title="Mark as Incomplete">
                        <CheckCircleFilled
                          onClick={() => handleUpdateStatus(item.id, false)}
                          style={{ color: "green" }}
                          className={styles.actionIcon}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Mark as Completed">
                        <CheckCircleOutlined
                          onClick={() => handleUpdateStatus(item.id, true)}
                          className={styles.actionIcon}
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noTaskWrapper}>
              <Empty />
            </div>
          )}
        </div>

        {/* Modals for adding and editing tasks */}
        <Modal
          confirmLoading={loading}
          title="Add New To Do Task"
          open={isAdding}
          onOk={handleSubmitTask}
          onCancel={() => setIsAdding(false)}
        >
          <Input
            style={{ marginBottom: "1rem" }}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input.TextArea
            style={{ marginBottom: "1rem" }}
            rows={4}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Modal>

        <Modal
          confirmLoading={loading}
          title="Update To Do Task"
          open={isEditing}
          onOk={handleUpdateTask}
          onCancel={() => setIsEditing(false)}
        >
          <Input
            style={{ marginBottom: "1rem" }}
            placeholder="Title"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <Input.TextArea
            style={{ marginBottom: "1rem" }}
            rows={4}
            placeholder="Description"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
          />
          <Select
            value={updatedStatus}
            onChange={(value) => setUpdatedStatus(value)}
            options={[
              { value: true, label: "Complete" },
              { value: false, label: "Incomplete" },
            ]}
          />
        </Modal>
      </section>
    </>
  );
}

export default ToDoList;
