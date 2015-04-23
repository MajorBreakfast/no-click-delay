var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent)

if (CustomEvent && iOS) {
  var clickEventsDisabledUntil = 0
  var touchPositions = {}
  
  window.addEventListener('touchstart', function(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
      var touch = event.changedTouches[i]
      touchPositions[touch.identifier] = [touch.clientX, touch.clientY]
    }
  })
  
  window.addEventListener('touchend', function(event) {
    // Disable click events for 10s.
    // Real click events probably don't occur on iOS anyway.
    clickEventsDisabledUntil = Date.now() + 10000
    
    for (var i = 0; i < event.changedTouches.length; i++) {
      var touch = event.changedTouches[i]
      
      var startPosition = touchPositions[touch.identifier]
      if (!startPosition) { continue }
      delete touchPositions[touch.identifier]

      var deltaX = startPosition[0] - touch.clientX
      var deltaY = startPosition[1] - touch.clientY
      if (Math.sqrt(deltaX*deltaX + deltaY*deltaY) < 5 ) {
        var click = new CustomEvent('click', { bubbles: true, detail: touch })
        event.target.dispatchEvent(click)
      }
    }
  })
  
  window.addEventListener('click', function(event) { // Catch real click events
    if (event instanceof MouseEvent && Date.now() < clickEventsDisabledUntil) {
      event.stopPropagation()
      event.preventDefault()
    }
  }, true)
}
