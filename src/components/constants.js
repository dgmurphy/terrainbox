export const FRAMETHRESH_GUI = 20
export const VEL_COEFF = 100
export const FIELD_EXTENTS = {
                xMax: 24.6,
                xMin: -24.6,
                zMax: 14.6,
                zMin: -14.6
           }
export const BASE_ZONE = {
    blue: {
        xMin: 14.55,
        xMax: 22.55,
        zMin: -11.5,
        zMax: 11.5
    },
    red: {
        xMin: -22.55,
        xMax: -14.55,
        zMin: -11.5,
        zMax: 11.5
    }
}
export const BASE_RADIUS = 1.5
export const RADAR_RADIUS = 5
export const RED_GOAL_LINE = -12.5
export const BLUE_GOAL_LINE = 12.5
export const phases = {
    SEEK_FLAG_ZONE: 'Seek Flag Zone',
    LOCATE_FLAG: 'Locate Flag',
    CAPTURE_FLAG: 'Capture Flag',
    RETURN_TO_BASE: 'Return to Base'
}

export const GUTTER_WIDTH = 2

export const edge = {
    NONE: "none",
    PLUS_X: "+x",
    MINUS_X: "-x",
    PLUS_Z: "+z",
    MINUS_Z: "-z"
}

// TODO consolidate
export const hotgrid = {

    CELL_SIZE: 3,
    ROWS: 9,
    COLUMNS: 4,

    blueBase: {

        XMIN: 12.55,
        XMAX: 24.55,
        ZMIN: -13.5,
        ZMAX: 13.5
    },

    redBase: {
 
        XMIN: -24.55,
        XMAX: -12.55,
        ZMIN: -13.5,
        ZMAX: 13.5        
    }

}

export const MORTAR_V = 0.3
export const MORTAR_YPEAK = 8
export const AGENT_SPEED = 0.18

export const TERRAIN_MESH_NAME = "Ntc Import Obj"