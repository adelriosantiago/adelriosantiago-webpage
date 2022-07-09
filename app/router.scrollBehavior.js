export default function scrollBehavior(to, from, savedPosition) {
    // savedPosition is only available for popstate navigations.
    if (savedPosition) return savedPosition

    // If the returned position is falsy or an empty object, retain current scroll position.
    if (to.params.savePosition) return {}

    // Scroll to anchor by returning the selector
    if (to.hash) {
        let position = { selector: to.hash }

        // Specify offset of the element
        // if (to.hash === '#anchor2') {
        //   position.offset = { y: 100 }
        // }
        return position
    }

    // Scroll to top by default
    return { x: 0, y: 0 }
}