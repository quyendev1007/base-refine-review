import React from 'react'
import { KanbanBoard, KanbanBoardContainer } from './list/board'
import { DragEndEvent } from '@dnd-kit/core'
import { KanbanColumn, KanbanColumnSkeleton } from './list/column'
import { HttpError, useList, useNavigation, useUpdate } from '@refinedev/core'
import { ProjectCardMemo, ProjectCardSkeleton } from './list/card'
import { KanbanItem } from './list/item'
import { KanbanAddCardButton } from '../components/button'
import { ActivityStatus } from '@/types/enum'

interface IUser {
  id: number
  name: string
  avatarUrl: string
}

interface ITask {
  id: number
  name: string
  description: string
  dueDate: string
  createdAt: string
  updatedAt: string
  status: ActivityStatus
  stageId: string
  users: IUser[]
}

interface IStage {
  id: string
  title: string
}

const TasksListPage = ({ children }: React.PropsWithChildren) => {
  const { data: tasks, isLoading: isLoadingTasks } = useList<ITask, HttpError>({
    resource: 'activities'
    // pagination: { current: 1, pageSize: 100 }
  })
  const { data: stages, isLoading: isLoadingStages } = useList<
    IStage,
    HttpError
  >({
    resource: 'stages'
  })

  console.log('tasks', tasks)
  console.log('stages', stages)

  //     unassignedStage: [
  //       {
  //         completed: false,
  //         createdAt: "2024-09-08T15:31:33.223Z",
  //         description:
  //           "Task: Develop Mobile App Prototype\n\nDescription: In this task, you will lead the development of a mobile app prototype based on the product requirements and design specifications. You will work closely with the UI/UX designers, developers, and product managers to ensure the prototype aligns with the overall product vision.\n\nYour technical expertise and problem-solving skills will be crucial in overcoming challenges and refining the app's functionality and user experience. Regular testing and feedback collection will help us iterate and improve the prototype throughout the development process.\n\nLet's create a user-friendly and visually appealing prototype that sets the stage for an exceptional mobile app!",
  //         dueDate: "2024-11-10T05:25:44.051Z",
  //         id: 3,
  //         stageId: null,
  //         title: "Develop Mobile App Prototype",
  //         updatedAt: "2025-07-04T04:17:55.840Z",
  //         users: [
  //           {
  //             avatarUrl:
  //               "https://refine-crm.ams3.cdn.digitaloceanspaces.com/avatars/4.jpg",
  //             id: 5,
  //             name: "Dwight Schrute",
  //           },
  //         ],
  //       },
  //     ],
  //     columns: [
  //       {
  //         id: 1,
  //         title: "TODO",
  //         tasks: [
  //           {
  //             completed: false,
  //             createdAt: "2024-09-08T15:31:33.223Z",
  //             description:
  //               "Task: Develop Mobile App Prototype\n\nDescription: In this task, you will lead the development of a mobile app prototype based on the product requirements and design specifications. You will work closely with the UI/UX designers, developers, and product managers to ensure the prototype aligns with the overall product vision.\n\nYour technical expertise and problem-solving skills will be crucial in overcoming challenges and refining the app's functionality and user experience. Regular testing and feedback collection will help us iterate and improve the prototype throughout the development process.\n\nLet's create a user-friendly and visually appealing prototype that sets the stage for an exceptional mobile app!",
  //             dueDate: "2024-11-10T05:25:44.051Z",
  //             id: 3,
  //             stageId: 1,
  //             title: "Develop Mobile App Prototype",
  //             updatedAt: "2025-07-04T04:17:55.840Z",
  //             users: [
  //               {
  //                 avatarUrl:
  //                   "https://refine-crm.ams3.cdn.digitaloceanspaces.com/avatars/4.jpg",
  //                 id: 5,
  //                 name: "Dwight Schrute",
  //               },
  //             ],
  //           },
  //           {
  //             completed: false,
  //             createdAt: "2024-09-08T15:31:33.223Z",
  //             description:
  //               "Task: Design User Interface for Web Application\n\nDescription: In this task, you will create a user-friendly and visually appealing user interface (UI) for our web application. You will collaborate with the product team to understand the requirements and design specifications, ensuring that the UI aligns with the overall product vision.\n\nYour design skills and attention to detail will be crucial in creating an intuitive and engaging user experience. Regular feedback and iterations will help us refine the UI throughout the design process.\n\nLet's create a stunning and functional UI that enhances the usability of our web application!",
  //             dueDate: "2024-11-10T05:25:44.051Z",
  //             id: 4,
  //             stageId: 1,
  //             title: "Design User Interface for Web Application",
  //             updatedAt: "2025-07-04T04:17:55.840Z",
  //             users: [
  //               {
  //                 avatarUrl:
  //                   "https://refine-crm.ams3.cdn.digitaloceanspaces.com/avatars/4.jpg",
  //                 id: 5,
  //                 name: "Dwight Schrute",
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       {
  //         id: 2,
  //         title: "In Progress",
  //         tasks: [
  //           {
  //             completed: false,
  //             createdAt: "2024-09-08T15:31:33.223Z",
  //             description:
  //               "Task: Implement Backend API for Mobile App\n\nDescription: In this task, you will develop the backend API for our mobile app, ensuring it meets the functional and performance requirements. You will work closely with the frontend team to ensure seamless integration between the backend and frontend components.\n\nYour technical expertise in backend development and API design will be crucial in delivering a robust and scalable solution. Regular testing and feedback collection will help us iterate and improve the API throughout the development process.\n\nLet's create a powerful and efficient backend API that supports our mobile app's functionality!",
  //             dueDate: "2024-11-10T05:25:44.051Z",
  //             id: 5,
  //             stageId: 2,
  //             title: "Implement Backend API for Mobile App",
  //             updatedAt: "2025-07-04T04:17:55.840Z",
  //             users: [
  //               {
  //                 avatarUrl:
  //                   "https://refine-crm.ams3.cdn.digitaloceanspaces.com/avatars/4.jpg",
  //                 id: 5,
  //                 name: "Dwight Schrute",
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       {
  //         id: 3,
  //         title: "Review",
  //         tasks: [
  //           {
  //             completed: false,
  //             createdAt: "2024-09-08T15:31:33.223Z",
  //             description:
  //               "Task: Conduct Code Review for Mobile App\n\nDescription: In this task, you will review the codebase of our mobile app to ensure it meets the coding standards and best practices. You will provide feedback to the development team and suggest improvements where necessary.\n\nYour attention to detail and expertise in code quality will be crucial in maintaining a high standard of code throughout the project. Regular reviews and feedback will help us improve the overall quality of the codebase.\n\nLet's ensure our mobile app's code is clean, efficient, and maintainable!",
  //             dueDate: "2024-11-10T05:25:44.051Z",
  //             id: 6,
  //             stageId: 3,
  //             title: "Conduct Code Review for Mobile App",
  //             updatedAt: "2025-07-04T04:17:55.840Z",
  //             users: [
  //               {
  //                 avatarUrl:
  //                   "https://refine-crm.ams3.cdn.digitaloceanspaces.com/avatars/4.jpg",
  //                 id: 5,
  //                 name: "Dwight Schrute",
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       {
  //         id: 4,
  //         title: "Done",
  //         tasks: [
  //           {
  //             completed: false,
  //             createdAt: "2024-09-08T15:31:33.223Z",
  //             description:
  //               "Task: Deploy Mobile App to Production\n\nDescription: In this task, you will deploy our mobile app to the production environment, ensuring it is ready for public use. You will work closely with the operations team to ensure a smooth deployment process and address any issues that may arise.\n\nYour expertise in deployment processes and troubleshooting will be crucial in delivering a successful launch. Regular monitoring and feedback collection will help us maintain the app's performance and reliability post-deployment.\n\nLet's make our mobile app available to users and ensure a seamless experience!",
  //             dueDate: "2024-11-10T05:25:44.051Z",
  //             id: 7,
  //             stageId: 4,
  //             title: "Deploy Mobile App to Production",
  //             updatedAt: "2025-07-04T04:17:55.840Z",
  //             users: [
  //               {
  //                 avatarUrl:
  //                   "https://refine-crm.ams3.cdn.digitaloceanspaces.com/avatars/4.jpg",
  //                 id: 5,
  //                 name: "Dwight Schrute",
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   };

  const taskStages = React.useMemo(() => {
    if (!tasks?.data || !stages?.data)
      return {
        stages: []
      }

    const unassignedStage = tasks.data.filter((task) => !task.stageId)

    // prepare unassigned stage
    const grouped = stages.data.map((stage) => ({
      ...stage,
      tasks: tasks.data.filter((task) => task.stageId === stage.id)
    }))

    return {
      unassignedStage,
      columns: grouped
    }
  }, [tasks, stages])

  console.log('taskStages', taskStages)

  const { replace } = useNavigation()

  const { mutate } = useUpdate({
    resource: 'tasks'
  })

  const handleOnDragEnd = (event: DragEndEvent) => {
    // Handle the drag end event here
    const stageId = event.over?.id as string
    const taskId = event.active.id as string
    const taskStageId = event.active.data.current?.stageId

    if (taskStageId === stageId) {
      return
    }

    mutate({
      id: taskId,
      values: {
        stageId
      }
    })
  }

  const handleAddCard = (args: { stageId: number | string }) => {
    const path =
      args.stageId === 'unassigned'
        ? '/tasks/new'
        : `/tasks/new?stageId=${args.stageId}`

    replace(path)
  }

  const isLoading = isLoadingTasks || isLoadingStages

  if (isLoading) return <PageSkeleton />

  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard onDragEnd={handleOnDragEnd}>
          <KanbanColumn
            id={'unassigned'}
            title={'unassigned'}
            count={taskStages.unassignedStage?.length || 0}
            onAddClick={() => handleAddCard({ stageId: 'unassigned' })}>
            {taskStages.unassignedStage?.map((task) => {
              return (
                <KanbanItem
                  key={task.id}
                  id={task.id}
                  data={{ ...task, stageId: 'unassigned' }}>
                  <ProjectCardMemo
                    {...task}
                    dueDate={task.dueDate || undefined}
                  />
                </KanbanItem>
              )
            })}
            {!taskStages.unassignedStage?.length && (
              <KanbanAddCardButton
                onClick={() =>
                  handleAddCard({
                    stageId: stages?.data[0].id || ''
                  })
                }
              />
            )}
          </KanbanColumn>
          {taskStages.columns?.map((column) => {
            return (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                count={column.tasks.length}
                onAddClick={() => handleAddCard({ stageId: column.id })}>
                {isLoading && <ProjectCardSkeleton />}
                {!isLoading &&
                  column.tasks.map((task) => {
                    return (
                      <KanbanItem key={task.id} id={task.id} data={task}>
                        <ProjectCardMemo
                          {...task}
                          dueDate={task.dueDate || undefined}
                        />
                      </KanbanItem>
                    )
                  })}
                {!column.tasks.length && (
                  <KanbanAddCardButton
                    onClick={() =>
                      handleAddCard({
                        stageId: column.id
                      })
                    }
                  />
                )}
              </KanbanColumn>
            )
          })}
        </KanbanBoard>
      </KanbanBoardContainer>
      {children}
    </>
  )
}

const PageSkeleton = () => {
  const columnCount = 6
  const itemCount = 4

  return (
    <KanbanBoardContainer>
      {Array.from({ length: columnCount }).map((_, index) => {
        return (
          <KanbanColumnSkeleton key={index}>
            {Array.from({ length: itemCount }).map((_, index) => {
              return <ProjectCardSkeleton key={index} />
            })}
          </KanbanColumnSkeleton>
        )
      })}
    </KanbanBoardContainer>
  )
}

export default TasksListPage
