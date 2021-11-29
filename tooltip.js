
/* 
!Extends: 
  ? You're telling JS that you are building your class based on some other base class

  ? HTMLElement class (object) is baked into the browser (not defined by us).

!Constructor:   
  ? default method name detected by JS and JS will automatically execute this method whenever this class is instatiated (whenever a new object based on this class is created)

!Super: 
  ? must always call super first when adding a constructor. This is a built in method you call inside of a class which will execute the constructor of the base class you are extending (HTMLElement).This is required

!Define: 
  ? define takes two arguments. First is a string where you define your own HTML tag. Tag name must be separated by a dash so as not to overwrite a built in HTML element. The second argument you pass in your JS class that holds the logic for this custom element.

  ? We define our own element and therefore this element has to be responsible for the constructor running

!Web Component Lifecycle: 
  ? There is a specific web component lifecycle which the browser follows when instantiating our own custom element objects in the DOM. 

  ? The first thing that gets executed is the constructor. This always gets executed when an object gets created based on your class and then the classes constructor gets executed. This is essentially called "Element Created"

  ? The moment where the element is created is NOT the moment where the element is then also attached into the real DOM by the browser, instead it's created in memory first and it's not part of the DOM at the beginning. 

  ? The constructor is great for some basic initializations, some basic values for different properties and variables you might be using in your class, in your component, but it's the wrong place for accessing the DOM because your custom element has not been added to the DOM yet. 

!connectedCallback()
  ? A method you can add in your class which will be executed by the browser once this element has been mounted onto the browser's DOM. 

  ? Called when your element has been attached to the DOM and therefore this is the place for DOM initializations.Where you can start adding content or where you can start accessing the DOM. 

!disconnectedCallback()
  ? This method will be called by the browser whenever your elements, your web component, is detached from the DOM (when you detroy that node). 

  ? A great method for some cleanup work, for examply if you were sending an HTTP request this would be where you could cancel it.

!attributeChangedCallback()
  ? Important for listening to changes to attributes to your own element. Important for updating the data and the DOM of your web component when some attributes which can be passed to your component change

!Attributes vs. Properties: 
  ? HTML attributes and DOM properties CAN be connected but don't have to. They're not the same.

!Shadow Dom: 
  ? Our element should have its own DOM behind it whick kind of makes up what we see on the page, but which is not directly connected to the real DOM, which is not affected by global styles

!attachShadow({}):
  ? Unlocks the shadow DOM 

  ? Pass in a JS object with mode: 'open'. The mode simply defines whether you can access your shadow DOM tree from the outside. Mostly always set to open, but you can set it close but even then there are still ways to access the shadow dom from the outside, so it is simply not worth the effort. 

!shadowRoot: 
  ? Allows us to access the Shadow DOM tree which we can append to
*/

class Tooltip extends HTMLElement {
    constructor() {
      super() 
      this._tooltipContainer;
      this._tooltipText = 'Dummy tooltip text.'
      this.attachShadow({mode: 'open'})
      this.shadowRoot.innerHTML = 
      //The styles here (since this is the innerHTML of the shadow root) will only apply to the HTML code in our template (i.e the span or the div we add dynamically)
      `
      <style> 
        div{
          background-color: black; 
          color: white; 
          position: absolute; 
          z-index: 10
        }
      </style> 
      <slot>Some Default</slot>
      <span> (?)</span>
      `
    }
    
    connectedCallback(){
      if(this.hasAttribute('text')){
        this._tooltipText = this.getAttribute('text')
      }
      const tooltipIcon = this.shadowRoot.querySelector('span')

      tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this))
      tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this))
      this.shadowRoot.appendChild(tooltipIcon)
      this.style.position = 'relative'
    }

    //underscore in front of a method name signals to other developers that you should not call this method, but does not prevent them from doing so.
     _showTooltip(){
      this._tooltipContainer = document.createElement('div')
      this._tooltipContainer.textContent = this._tooltipText;
      this.shadowRoot.appendChild(this._tooltipContainer)
    }

    _hideTooltip(){
      this.shadowRoot.removeChild(this._tooltipContainer)
    }
}

customElements.define('am-tooltip', Tooltip) 
