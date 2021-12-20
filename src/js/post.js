import { Modal } from 'bootstrap'
import { marked } from 'marked'
import { $ } from './helpers'

class Post {
  constructor(containerElement) {
    this.containerElement = containerElement

    this.init()
  }

  init() {
    this.modalElement = $('#formModal')
    this.instanceModal = Modal.getOrCreateInstance(this.modalElement)

    this.handlePostClick = this.handlePostClick.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.handleClickEdit = this.handleClickEdit.bind(this)
    this.handlePostClear = this.handlePostClear.bind(this)

    window.addEventListener('post:click', this.handlePostClick)
    this.containerElement.addEventListener('click', this.handleClickDelete)
    window.addEventListener('post:clear', this.handlePostClear)
    this.containerElement.addEventListener('click', this.handleClickEdit)
  }

  async handlePostClick({ detail }) {
    const { id } = detail
    $('#owl').classList.remove('owl')
    const data = await this.getPost(id)
    
    this.render(data)
  }

  async getPost(id) {
    const url = `/api/posts/${id}`

    const response = await fetch(url)
    const post = await response.json()

    return post
  }

  getTemplatePost({ title, photo, content, latin, date, id }) {
    const html = marked.parse(content)
    
    return `
      <h2>${title}</h2>

      <h4><strong>${latin}</strong></h4>

      <img src="${photo}" alt="owl">
      
      <div class="mb-4">${html}</div>

      <div class="text-muted mb-4">Дата последнего обновления: ${date}</div>

      <button type="button" class="btn btn-outline-info me-2" data-id="${id}" data-role="edit">Редактировать</button>
      <button type="button" class="btn btn-outline-danger" data-id="${id}" data-role="delete">Удалить</button>
    `
  }

  async handleClickDelete({ target }) {
    if (target.dataset.role === 'delete') {
      const { id } = target.dataset

      const isRemove = confirm('Вы точно хотите удалить?')

      if (!isRemove) return

      await this.removePost(id)
      this.containerElement.innerHTML = ''
      $('#owl').classList.add('owl')

      const event = new Event('posts:needsRender')
      window.dispatchEvent(event)
    }
  }

  async removePost(id) {
    const url = `/api/posts/${id}`

    const response = await fetch(url, { method: 'DELETE' })
    const post = await response.json()

    return post
  }

  handlePostClear () {
    this.clear()
  }

  async handleClickEdit ({ target }) {
    if (target.dataset.role === 'edit') {
      const { id } = target.dataset

      const data = await this.getPost(id)
      const event = new CustomEvent('form:setEdit', {
        detail: { data }
      })
      window.dispatchEvent(event)
    }
  }

  async removePost (id) {
    const url = `/api/posts/${id}`

    const response = await fetch(url, { method: 'DELETE' })
    const post = await response.json()

    return post
  }

  render(data) {
    const postHTML = this.getTemplatePost(data)
    this.containerElement.innerHTML = postHTML
  }

  clear () {
    this.containerElement.innerHTML = ''
    $('#owl').classList.add('owl')
  }
}

export { Post }
