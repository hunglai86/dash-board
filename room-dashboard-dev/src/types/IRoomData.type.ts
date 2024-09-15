export interface IFrameData {
    timestamp: number
    number_people: number
    distribution: number
}

export interface ICameraData {
    camera_ip: string
    camera_id: string
    video_source: string
    camera_width: number
    camera_height: number
    encode: string
}

export interface IRoomInfo {
    _id?: string | null
    name: string
    camera?: Array<ICameraData>
    capacity: number
    active: boolean
}

export interface IRoomData extends IRoomInfo {
    series_data: Array<IFrameData>
}

export interface ImageResponse {
    extension: string
    image_base64: string
    width: number
    height: number
}
