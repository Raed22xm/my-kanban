// KanbanBoard.spec.ts

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KanbanBoard from '../src/components/KanbanBoard.vue'

describe('KanbanBoard', () => {
  it('renders three columns by default', () => {
    // 1) Mount the KanbanBoard component
    const wrapper = mount(KanbanBoard)
    
    // 2) Find all elements with class "column"
    const columns = wrapper.findAll('.column')
    // By default, you have 3 columns: To Do, In Progress, Done
    expect(columns.length).toBe(3)
  })

  it('adds a new card to "To Do" when the form is submitted', async () => {
    // 1) Mount
    const wrapper = mount(KanbanBoard)
    
    // 2) Initially, "To Do" has 2 cards
    let cards = wrapper.findAll('.card')
    expect(cards.length).toBe(2)

    // 3) Type into the input
    const input = wrapper.find('input')
    await input.setValue('New Task')

    // 4) Click the "Add Card to 'To Do'" button (the first button)
    //    or locate it by text if needed
    const addButton = wrapper.find('button')
    await addButton.trigger('click')

    // 5) Now, "To Do" should have 3 cards
    cards = wrapper.findAll('.card')
    expect(cards.length).toBe(3)
    // The last card should have the title "New Task"
    const lastCard = cards[2]
    expect(lastCard.text()).toContain('New Task')
  })

  it('deletes a card when the Delete button is clicked', async () => {
    // 1) Mount
    const wrapper = mount(KanbanBoard)

    // "To Do" starts with 2 cards
    let cards = wrapper.findAll('.card')
    expect(cards.length).toBe(2)

    // 2) Find the "Delete" button for the first card
    // The first card's buttons are "Edit" and "Delete".
    // They are the second and third <button> overall (the first button is "Add Card").
    // We'll find all <button> elements and pick the correct index.
    
    // Another approach: search by text content (requires a library or custom code).
    const buttons = wrapper.findAll('button')
    // "buttons[0]" is "Add Card to 'To Do'"
    // "buttons[1]" might be "Edit" for card #1
    // "buttons[2]" might be "Delete" for card #1
    // or the indexing could be different if there are multiple columns
    // so let's carefully debug if needed.

    // For this basic test, let's assume "buttons[2]" is "Delete" for the first card:
    await buttons[2].trigger('click')

    // 3) Expect only 1 card left
    cards = wrapper.findAll('.card')
    expect(cards.length).toBe(1)
  })
})
