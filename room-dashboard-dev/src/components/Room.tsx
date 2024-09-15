import React, {ErrorInfo, useEffect, useState} from 'react'
import {useAppSelector, useAppDispatch} from '../store/hooks'
import {Card, message, Carousel, Image, Popconfirm, Progress} from 'antd'
import {EditOutlined, SettingOutlined, DeleteOutlined} from '@ant-design/icons';
import {ICameraData, IFrameData, IRoomInfo, ImageResponse} from "../types/IRoomData.type";
import RoomService from "../services/room.service";
import {RoomChart} from "./RoomChart";
import type {PopconfirmProps} from 'antd';
import {removeRoom} from "../store/roomSlice";
import {UpdateRoom} from "./UpdateRoom";
import {usePub} from "../common/EventBus";

const gridStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    alignItems: 'center'
};

const gridLabelStyle: React.CSSProperties = {
    width: '33%',
    height: '70px',
    textAlign: 'center',
    alignItems: 'center'
};

const gridContentStyle: React.CSSProperties = {
    width: '67%',
    height: '70px',
    textAlign: 'center',
    alignItems: 'center',
    margin: 'auto',
    backgroundColor: 'lightgreen',
}

const gridWarningContentStyle: React.CSSProperties = {
    width: '67%',
    height: '70px',
    textAlign: 'center',
    alignItems: 'center',
    margin: 'auto',
    backgroundColor: 'yellow',
}

const gridHighContentStyle: React.CSSProperties = {
    width: '67%',
    height: '70px',
    textAlign: 'center',
    alignItems: 'center',
    margin: 'auto',
    backgroundColor: 'red',
}

export function Room(roomData: IRoomInfo) {
    const dispatch = useAppDispatch();
    const {user: currentUser} = useAppSelector((state) => state.auth);

    const _id = (roomData._id == null) ? '' : roomData._id;
    const name = roomData.name;
    const capacity: number = roomData.capacity;
    const camera: Array<ICameraData> = roomData.camera === undefined ? [] : roomData.camera;
    const activate: boolean = roomData.active;

    // const style_width_camera: string = ((100 -33) / camera.length).toString() + '%';
    let initialImages = camera.map((cam: ICameraData, index: number) => {
        return {extension: 'jpg', image_base64: '', width: 0, height: 0} as ImageResponse;
    });

    const [images, setImages] = useState<Array<ImageResponse>>(initialImages);
    const [previewImages, setPreviewImages] = useState<Array<string>>([]);
    const [series, setSeries] = useState<Array<IFrameData>>([]);

    let distribution: number = 0;
    let numberPeople: number = 0;
    let date: Date | null = null;

    // const [open, setOpen] = useState(false);
    // const [confirmLoading, setConfirmLoading] = useState(false);



    const publish = usePub();

    useEffect(() => {
        // setImages(initialImages);
        retrieveData();
        if (camera.length > 0) {
            retrieveScaleImages();
            retrieveImages();
        }
    }, []);


    const retrieveData = () => {
        RoomService.getLastAnalyzedRooms(_id)
            .then((response: any) => {
                // console.log(response);
                setSeries(response.data);
            })
            .catch((e: any) => {
                console.log(e);
                console.log(e.response.status);
                if (e.response && e.response.status === 401) {
                    publish('logout', {});
                }
            })
    }


    const retrieveImages = async () => {
        const objectURLImages: string[] = [];
        await Promise.all(
            camera.map(async (cam: ICameraData) => {
                await RoomService.getImageRoom(_id, cam.camera_id)
                    .then((response: any) => {
                        // const imageBlob = response.data;
                        const imageObjectURL = URL.createObjectURL(response.data);
                        objectURLImages.push(imageObjectURL);
                        // setImage(imageObjectURL);
                    })
                    .catch((e: any) => {
                        objectURLImages.push('')
                        if (e.response && e.response.status === 401) {
                            publish('logout', {});
                        }
                    });
            })
        )
        return setPreviewImages(objectURLImages);
        // console.log(objectURLImages);
    }

    const retrieveScaleImages = async () => {
        const fetchImages: ImageResponse[] = [];
        await Promise.all(
            camera.map(async (cam: ICameraData) => {
                await RoomService.getScaleImageRoom(_id, cam.camera_id, 0.25)
                    .then((response: any) => {
                        const imageObject = response.data as ImageResponse;
                        fetchImages.push(imageObject);
                    })
                    .catch((e: any) => {
                        let emptyObject = {extension: 'jpg', image_base64: '', width: 0, height: 0} as ImageResponse;
                        fetchImages.push(emptyObject);
                        if (e.response && e.response.status === 401) {
                            publish('logout', {});
                        }
                    });
            })
        )
        return setImages(fetchImages);
    }

    const deleteRoom = () => {
        RoomService.deleteRoom(_id)
            .then((response: any) => {
                message.success("Deleted room");
                dispatch(removeRoom(roomData));
            })
            .catch((e: any) => {
                if (e.response && e.response.status === 401) {
                    publish('logout', {});
                }
                message.error(`Could not delete room cause ${e.response?.data.message}`);
            });

    }

    const confirm: PopconfirmProps['onConfirm'] = (e) => {
        deleteRoom();
    };

    const cancel: PopconfirmProps['onCancel'] = (e) => {
    };


    if (series.length > 0) {
        numberPeople = series[series.length - 1].number_people;
        distribution = series[series.length - 1].distribution;
        date = new Date(series[series.length - 1].timestamp);
    }

    if (images.length < camera.length) {
        for (let i=images.length; i < camera.length; i++) {
            images.push({extension: 'jpg', image_base64: '', width: 0, height: 0} as ImageResponse);
        }
    }

    return (
        <div style={{
            // position: 'relative',
            // maxWidth: "40vh",
            // minWidth: "40vh",
            // minHeight: "30vh",
            // padding: '0px 20px',
            // display: "flex",
            // flex-direction: "column"
            // margin: '20px 20px',
        }}>
            <Card
                key={roomData._id}
                title={name}
                style={{
                    width: "100%",
                    maxWidth: '35vh',
                    padding: '0px 20px',
                    minWidth: '600px',
                    minHeight: '600px'
                    // margin: '20px 20px',
                }}
                hoverable={true}
                extra={<RoomChart active={activate} camera={camera} capacity={capacity} name={name} _id={_id}/>}
                cover={
                    <Carousel autoplay={true} arrows infinite={false} style={{
                        height: '50%',
                        // flex: 1,
                        alignItems: "center"
                    }}>
                        {
                            camera.length > 0 ?
                                camera.map((cam: ICameraData, index: number) => {
                                    return (
                                        <Card key={cam.camera_id} style={gridStyle}>
                                            <Image
                                                // width={400}
                                                // height={300}
                                                alt={"Camera " + cam.camera_id}
                                                src={"data:image/" + images[index].extension + ";base64," + images[index].image_base64}
                                                preview={{src: previewImages[index]}}
                                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                                            >
                                            </Image>
                                        </Card>
                                    )
                                }) : (<Card key="null" style={gridStyle}>
                                    <Image
                                        // width="100%"
                                        // height={300}
                                        alt="No camera"
                                        // src=
                                        fallback="data:image/png;base64,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"
                                    >
                                    </Image>
                                </Card>)
                        }
                    </Carousel>
                }
                actions={[
                    <SettingOutlined key="setting"/>,

                    <UpdateRoom {...roomData} />,

                    <Popconfirm disabled={!currentUser!.role.includes("admin")}
                        title="Delete the task"
                        description="Are you sure to delete this room?"
                        onConfirm={confirm}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined key="ellipsis"/>
                    </Popconfirm>,
                ]}
            >

                <Card.Grid
                    style={gridLabelStyle}>Date: {date == null ? "No record" : date?.toLocaleDateString('en-GB')}</Card.Grid>

                {/*<Card.Grid*/}
                {/*    style={numberPeople / capacity < 0.5 ? gridContentStyle : gridWarningContentStyle}>*/}
                {/*    {numberPeople} / {capacity} */}
                {/*</Card.Grid>*/}

                <Card.Grid
                    style={numberPeople / capacity < 0.5 ? gridContentStyle : gridWarningContentStyle}>
                    {/*<Progress percent={numberPeople/capacity} percentPosition={{ align: 'center', type: 'inner' }}*/}
                    {/*format={() => numberPeople + " / "  + capacity}>*/}

                    {/*</Progress>*/}
                    {numberPeople} / {capacity}
                </Card.Grid>

                <Card.Grid
                    style={gridLabelStyle}>Time: {date == null ? "No record" : date?.toLocaleTimeString('it-IT')} </Card.Grid>
                <Card.Grid
                    style={distribution < 50 ? gridContentStyle : gridWarningContentStyle}>{distribution} </Card.Grid>
                <Card.Grid style={gridLabelStyle}>Camera</Card.Grid>
                {
                    camera.length > 0 ?
                        camera.map((cam) => {
                            return (
                                <Card.Grid style={{
                                    textAlign: 'center',
                                    width: `${((100 - 33) / camera.length).toString() + '%'}`,
                                }}>
                                    <a
                                        href={"https://" + cam.camera_ip}
                                        target="_blank"
                                    >
                                        {cam.camera_id}
                                    </a>
                                </Card.Grid>
                            )
                        }) : (
                            <Card.Grid style={{
                                textAlign: 'center',
                                width: `${(100 - 33).toString() + '%'}`,
                                color: "red"
                            }}>
                                No camera
                            </Card.Grid>
                        )
                }

                {/*<button onClick={() => {dispatch(updateRoom())}}>Update</button>*/}
            </Card>
        </div>
    )
}
