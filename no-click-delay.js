var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent)

if (CustomEvent && iOS) {
  // Tap tracking
  var clickEventsDisabledUntil = 0
  var startPositions = {}

  function addPotentialTap(touch) {
    startPositions[touch.identifier] = [touch.clientX, touch.clientY]
  }

  function updatePotentialTap(touch) {
    var startPosition = startPositions[touch.identifier]
    if (!startPosition) { return }

    var deltaX = startPosition[0] - touch.clientX
    var deltaY = startPosition[1] - touch.clientY

    if (Math.sqrt(deltaX*deltaX + deltaY*deltaY) > 5 ) {
      removePotentialTap(touch) // Discard it, it's not a tap
    }
  }

  function removePotentialTap(touch) {
    delete startPositions[touch.identifier]
  }

  function checkIfTap(touch) {
    return !!startPositions[touch.identifier]
  }

  // Event listeners
  window.addEventListener('touchstart', function(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
      addPotentialTap(event.changedTouches[i])
    }
  })

  window.addEventListener('touchmove', function(event) {
    for (var i = 0; i < event.changedTouches.length; i++) {
      updatePotentialTap(event.changedTouches[i])
    }
  })
  
  window.addEventListener('touchend', function(event) {
    // Disable click events for 10s.
    // Real click events probably don't occur on iOS anyway.
    clickEventsDisabledUntil = Date.now() + 10000
    
    for (var i = 0; i < event.changedTouches.length; i++) {
      var touch = event.changedTouches[i]
      updatePotentialTap(touch)

      if (checkIfTap(touch)) {
        var click = new CustomEvent('click', { bubbles: true, detail: touch })
        event.target.dispatchEvent(click)
      }

      removePotentialTap(touch)
    }
  })
  
  window.addEventListener('click', function(event) { // Catch real click events
    if (event instanceof MouseEvent && Date.now() < clickEventsDisabledUntil) {
      event.stopPropagation()
      event.preventDefault()
    }
  }, true)
}
