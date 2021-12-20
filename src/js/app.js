import '../scss/app.scss'
import bootstrap from 'bootstrap'
import { $ } from './helpers'
import { Form } from './form'
import { Posts } from './posts'
import { Post } from './post'

const formElement = $('#form')
const postsElement = $('#posts')
const postElement = $('#post')

const form = new Form(formElement)
const posts = new Posts(postsElement)
const post = new Post(postElement)
