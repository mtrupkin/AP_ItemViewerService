# Loading Items

The Item Viewer Service supports loading individual items or grouped performance task items.
Optional ISAAP accessibility codes may specified to enable accessibility options.

## Loading a Single Item
The URL for loading an individual item is mapped to `/item/{ItemBank-ItemID}`.
For example, to load an item with bank 123 and id 5678 the url would be `/item/123-5678`.

## Loading a Performance Task Item
To load a performance task item you need to know the banks and ids for each of the grouped items you wish to load.
The URL for loading performance task items is `/items?ids=ItemBank-ItemID1,ItemBank-ItemID2,ItemBank-ItemID3`.
For example, to load a performance task with items 187-1435, 187-1436, and 187-1437 the request would look like
`/items?ids=187-1435,187-1436,187-1437`

## Specifying Accessibility Codes
The optional accessibility codes are specified using the `isaap` url parameter.
Feature codes are passed as a semicolon separated list.
Only the feature code should be included. Feature family is not included.
For example, to load the reverse contrast and print size zoom level 1 accessibility options the parameter would look like
`issap=TDS_CCInvert;TDS_PS_L1`

Feature codes with the "&" character should be URL encoded.
It is good practice to always URL encode the list of ISAAP codes.
For a full list of feature codes please refer to the accessibility feature code
[documentation](http://www.smarterapp.org/documents/ISAAP-AccessibilityFeatureCodes.pdf).

## Examples
Loading item 187-856 with the yellow on blue color contrast and print zoom level 4 accessibility options.  
`http://itemviewerservice.example/item/187-856?isaap=TDS_CCYellowB;TDS_PS_L4`


Loading performance task with items 187-1435, 187-1436, and 187-1437, 
and the yellow on blue color contrast and print zoom level 4 accessibility options.  
`http://itemviewerservice.example/items?ids=187-1435,187-1436,187-1437&isaap=TDS_CCYellowB;TDS_PS_L4`

