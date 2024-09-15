import React, {useEffect, useState} from "react";
import {Button, DatePicker, Modal} from "antd";
import {Line, LineConfig} from '@ant-design/charts';
import dayjs from 'dayjs';
import {format} from 'fecha';

import {ICameraData, IFrameData, IRoomData, IRoomInfo} from "../../types/IRoomData.type";
import RoomService from "../../services/room.service";
import {usePub} from "../../common/EventBus";



const {RangePicker} = DatePicker;

export interface DataLine {
    data: any[]
    xField: string
    yField: string
    point: any
    interaction: any
    style: any
}

export interface OptionLine {
    responsive: boolean
    plugins: any
}

// const dateFormat = 'YYYY-MM-DD';

export const RoomChart = (room_: IRoomInfo) => {
    const room_id = room_._id == null ? '' : room_._id.toString();
    const room_name = room_.name
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    // const [dataRoom, setDataRoom] = useState<IRoomData>();

    const initialStartDate = new Date();
    initialStartDate.setDate(initialStartDate.getDate() - 1);
    initialStartDate.setHours(0,0,0,0);

    const initialEndDate = new Date();
    initialEndDate.setHours(23,59,59,0);
    const [startDate, setStartDate] = useState<Date>(initialStartDate);
    const [endDate, setEndDate] = useState<Date>(initialEndDate);

    const publish = usePub();

    const initialDataLine = {
        data: Array<IFrameData>(),
        xField: (d: IFrameData) => new Date(d.timestamp),
        yField: 'number_people',
        axis: {x: {title: false, size: 40}, y: {title: false, size: 36}},
        point: {
            shapeField: 'point',
            sizeField: 2,
        },
        slider: {
            x: {labelFormatter: (d: Date) => format(d, 'YYYY/MM/DD')},
            y: {labelFormatter: '~s'},
        },
        interaction: {
            tooltip: {
                marker: false,
            },
        },
        style: {
            lineWidth: 1,
        },
    }

    const [data, setData] = useState<LineConfig>(initialDataLine);

    const showChart = () => {
        setOpen(true);
        setLoading(true);

        retrieveData(startDate.getTime()/1000, endDate.getTime()/1000).then((r_config: LineConfig) => {
            // console.log(r_config);
            setData(r_config);
            setLoading(false);
        });
    }

    const retrieveData = async (start_time?:number, end_time?:number): Promise<LineConfig> => {
        const config: LineConfig = initialDataLine;
        try {
            let response: any = await RoomService.getAnalyzedRoom(room_id, start_time, end_time);
            // console.log(response);
            config.data = response.data;
        } catch (error: any) {
            console.log(error);
            if (error.response && error.response.status == 401) {
                publish('logout', {});
            }
        }

        return config;
    }

    const handleCancel = () => {
        setOpen(false);
    };

    const handleOk = () => {
        setOpen(false);
    };

    const onChangeDateRange = (value: any, dateString: string[]) => {
        // console.log('Selected Time: ', value);
        // console.log('Formatted Selected Time: ', dateString);
        if (dateString.length > 1 && dateString[0] && dateString[1]) {
            setLoading(true);
            let start_date = new Date(dateString[0] + " 00:00:00");
            let end_date = new Date(dateString[1] + " 23:59:59");
            setStartDate(start_date);
            setEndDate(end_date);
            // end_date.setDate(end_date.getDate() + 1);
            let start_time = start_date.getTime() / 1000;
            let end_time = end_date.getTime() / 1000;
            // console.log(start_time);
            // console.log(end_time);
            retrieveData(start_time, end_time).then((r_config: LineConfig) => {
                // console.log(r_config);
                setData(r_config);
                setLoading(false);
            });
        }
    }

    return (
        <>
            <Button type="primary" onClick={showChart}>
                More
            </Button>
            <Modal style={{
                flex: 'revert',
                width: "100%",
            }}
                   title={<p>Room {room_name}</p>}
                   loading={loading}
                   open={open}
                   onCancel={handleCancel}
                   onOk={handleOk}
                   centered
            >
                <RangePicker
                    format="YYYY-MM-DD"
                    onChange={onChangeDateRange}
                    defaultValue={[dayjs(startDate), dayjs(endDate)]}
                />
                <div>
                    {(data.data.length > 0) ?
                        <Line {...data} /> : <Line></Line>
                    }
                    {/*<Line data={data.data} />*/}
                </div>
            </Modal>
        </>
    );
}
