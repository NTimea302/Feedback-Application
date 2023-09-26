sap.ui.define([], function() {
    return {
        formatFloat: function(value) {
            if (typeof value === "number") {
                // Format the float value as desired
                return value.toFixed(2); // Example: Display with 2 decimal places
            }
            return value; // Return the original value if not a number
        }
    };
});
