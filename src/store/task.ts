import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";
import {Task} from "../models/task.model.ts";
import {useDraftsStore} from "./drafts.ts";
import dayjs from "dayjs";
import {nanoid} from "nanoid";


export const useTaskStore = defineStore("task", {
    state: () => ({
        tasks: useLocalStorage<Task[]>("tasks", [])
    }),
    actions: {
        commitDraft(draftId: string, dateTodo: string): Task | undefined {
            const draftStore = useDraftsStore()

            const draft = draftStore.getOne(draftId)
            if (!draft) return

            const task: Task = {
                id: nanoid(3),
                title: draft.title,
                status: "todo",
                dateUpdated: draft.dateUpdated,
                dateCreated: draft.dateCreated,
                dateCommitted: dayjs().toISOString(),
                dateCompleted: null,
                dateTodo
            }

            this.tasks.push(task)
            draftStore.remove(draftId)
        },
        changeTodoDate(taskId: string, newDate: string): Task | undefined {
            const taskIdx = this.tasks.findIndex(t => t.id === taskId)
            this.tasks[taskIdx].dateTodo = newDate
            // this.tasks.splice(taskIdx, 1, {...this.tasks[taskIdx], dateTodo: newDate})

            return this.tasks[taskIdx]
        },
        update(taskId: string, newTask: Partial<Task>): void {
            const taskIdx = this.tasks.findIndex(t => t.id === taskId)
            this.tasks.splice(taskIdx, 1, {...this.tasks[taskIdx], ...newTask})

            // return this.tasks[taskIdx]
        },
        remove(taskId: string): void {
            const taskIdx = this.tasks.findIndex(t => t.id === taskId)
            this.tasks.splice(taskIdx, 1)
        }
    },
    getters: {
        getByDate(state) {
            return (date: string): Task[] => {
                const searchedDate = dayjs(date)

                return state.tasks.filter(t => {
                        return dayjs(t.dateTodo).isSame(searchedDate, "day")
                    }
                )
            }
        },
        // groupByDates(state): { [date: string]: Task[] } {
        //     const res = {}
        //     this.tasks.forEach(t => {
        //         if (dayjs.unix(t.dateTodo).format("DD-MM") in res) {
        //             res[dayjs.unix(t.dateTodo).format("DD-MM")].push(t)
        //         } else {
        //             res[dayjs.unix(t.dateTodo).format("DD-MM")] = [t]
        //         }
        //     })
        //     return res
        // },
        getOne(state) {
            return (taskId: string): Task | undefined => {
                return state.tasks.find(t => t.id === taskId)
            }
        }
    }
})
