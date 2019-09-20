export function formatNumber(number) {
    if (number < 1000) {
      return number.toFixed(2)
    } else if (number < 1000000) {
      return `${(number / 1000).toFixed(2)}K`
    } else {
      return `${(number / 1000000).toFixed(2)}M`
    }
  }
  
  export function formatWholeNumber(number) {
    if (number < 1000) {
      return number
    } else if (number < 1000000) {
      return `${(number / 1000).toFixed(2)}K`
    } else {
      return `${(number / 1000000).toFixed(2)}M`
    }
  }
  
  export function getPlacementText(position) {
    switch (position) {
      case (0):
        return 'N/A'
      case (1):
        return '1st'
      case (2):
        return '2nd'
      case (3):
        return '3rd'
      default:
        return `${position}th`
    }
  }
  
  export function formatDate (dateString) {
    var stringToDate = new Date(dateString)
    return stringToDate.toLocaleDateString()
  }
  