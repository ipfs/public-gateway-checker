import { TagStatus } from './TagStatus'

type TagClasses = 'Status' | 'Node' | 'Cors' | 'Origin' | 'Flag'

type TagContent = TagStatus

class Tag {
  element: HTMLElement
  constructor (tagName: keyof HTMLElementTagNameMap = 'div', className: TagClasses | undefined = undefined, textContent: TagContent = TagStatus.pending) {
    const element = document.createElement(tagName)
    this.element = element

    if (className != null) {
      this.className = className
    }
    this.textContent = textContent
  }

  public static fromElement (element: HTMLElement) {
    const tag = new Tag('div')
    tag.element = element

    return tag
  }

  /**
   * Use the below functions to keep displays consistent
   */
  asterisk () {
    this.textContent = TagStatus.asterisk
  }

  lose () {
    this.textContent = TagStatus.failed
  }

  win (url?: string) {
    if (url != null) {
      this.textContent = TagStatus.empty
      const linkToImageSubdomain = document.createElement('a')
      linkToImageSubdomain.href = url
      linkToImageSubdomain.target = '_blank'
      linkToImageSubdomain.textContent = TagStatus.successful
      this.element.title = url
      this.element.appendChild(linkToImageSubdomain)
    } else {
      this.textContent = TagStatus.successful
    }
  }

  global () {
    this.textContent = TagStatus.global
  }

  err () {
    this.textContent = TagStatus.caution
  }

  empty () {
    this.textContent = TagStatus.empty
  }

  get style () {
    return this.element.style
  }

  append (child: string | Node | Tag) {
    if (child instanceof Tag) {
      child = child.element
    }
    return this.element.append(child)
  }

  get classList () {
    return this.element.classList
  }

  // eslint-disable-next-line accessor-pairs
  set title (newTitle: string) {
    this.element.title = newTitle
  }

  // eslint-disable-next-line accessor-pairs
  private set className (className: TagClasses) {
    this.element.className = className
  }

  // eslint-disable-next-line accessor-pairs
  private set textContent (content: typeof this.element.textContent) {
    this.element.textContent = content
  }
}

export type { TagClasses, TagContent }
export { Tag }
