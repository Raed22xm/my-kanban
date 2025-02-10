<template>
  <section class="kanban-board">
    <h2>My Kanban Board</h2>

    <!-- Add a new card -->
    <div class="add-form">
      <input v-model="newCardTitle" placeholder="Add new card title..." />
      <button @click="addCard">Add Card to 'To Do'</button>
    </div>

    <!-- Columns -->
    <div class="columns">
      <div v-for="(col, colIndex) in columns" :key="col.id" class="column">
        <h3>{{ col.name }}</h3>
        <draggable v-model="col.cards" :group="'cards'" :item-key="'id'" @end="onDragEnd">
          <template #item="{ element, index }">
            <div class="card">
              <!-- If editingCardId === this card's ID, show edit mode. Otherwise, normal mode. -->
              <div v-if="editingCardId === element.id">
                <!-- EDIT MODE -->
                <input v-model="tempTitle" />
                <textarea v-model="tempDescription"></textarea>
                <button @click="saveEdit(colIndex, index, element.id)">Save</button>
                <button @click="cancelEdit">Cancel</button>
              </div>
              <div v-else>
                <!-- NORMAL MODE -->
                <h4>{{ element.title }}</h4>
                <p>{{ element.description }}</p>
                <button @click="startEdit(element)">Edit</button>
                <button @click="deleteCard(colIndex, index)">Delete</button>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'

// 1) Define your data interfaces (Card & Column)
interface Card {
  id: string
  title: string
  description: string
}

interface Column {
  id: string
  name: string
  cards: Card[]
}

// 2) Reactive state with type annotations
const columns = ref<Column[]>([
  {
    id: 'col-1',
    name: 'To Do',
    cards: [
      { id: 'card-1', title: 'Task 1', description: 'Description of Task 1' },
      { id: 'card-2', title: 'Task 2', description: 'Description of Task 2' }
    ]
  },
  {
    id: 'col-2',
    name: 'In Progress',
    cards: []
  },
  {
    id: 'col-3',
    name: 'Done',
    cards: []
  }
])

// 3) "newCardTitle" typed as a string
const newCardTitle = ref<string>('')

// 4) Add card (no return value => void)
function addCard(): void {
  if (!newCardTitle.value.trim()) return
  columns.value[0].cards.push({
    id: Date.now().toString(),
    title: newCardTitle.value,
    description: 'New task!'
  })
  newCardTitle.value = ''
}

// 5) Draggable event handler (evt could be typed more strictly if you want)
function onDragEnd(evt: any): void {
  console.log('Drag ended:', evt)
}

// 6) Delete card
function deleteCard(colIndex: number, cardIndex: number): void {
  columns.value[colIndex].cards.splice(cardIndex, 1)
}

// 7) Editing logic
const editingCardId = ref<string | null>(null)
const tempTitle = ref<string>('')
const tempDescription = ref<string>('')

// "card" uses our Card interface
function startEdit(card: Card): void {
  editingCardId.value = card.id
  tempTitle.value = card.title
  tempDescription.value = card.description
}

// saveEdit uses colIndex, cardIndex, and cardId (all typed)
function saveEdit(colIndex: number, cardIndex: number, cardId: string): void {
  const colCards = columns.value[colIndex].cards
  const card = colCards.find((c) => c.id === cardId)
  if (card) {
    card.title = tempTitle.value
    card.description = tempDescription.value
  }
  editingCardId.value = null
}

function cancelEdit(): void {
  editingCardId.value = null
}
</script>

<style scoped>
.kanban-board {
  padding: 1rem;
}
.add-form {
  margin-bottom: 1rem;
}
.columns {
  display: flex;
  gap: 1rem;
}
.column {
  width: 250px;
  background-color: #fbb1b1;
  border-radius: 8px;
  padding: 1rem;
}
.card {
  background-color: #9f9898;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 0.5rem 0;
  padding: 0.5rem;
}

/* Just some spacing for the text area */
textarea {
  width: 100%;
  height: 4rem;
  margin-top: 0.5rem;
}
</style>
