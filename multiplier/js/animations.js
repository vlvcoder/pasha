export const animations = {
    LANDING_PRESENT: [
        {
            offset: 0,
            transform: 'translateY(-50px) scaleX(.01)',
        },
        {
            offset: 1,
            transform: 'translateY(0) scaleX(1)',
        },
    ],
    LINE_ERROR: [
        {
            offset: 0,
            transform: 'scale(1)',
            backgroundColor: 'var(--lineColor)',
        },
        {
            offset: 0.5,
            transform: 'scale(1.1)',
            backgroundColor: 'var(--errorColor)',
        },
        {
            offset: 1,
            transform: 'scale(1)',
            backgroundColor: 'var(--lineColor)',
        },
    ],
    HIDE_TAG: [
        { opacity: 1 },
        { opacity: 0 },
    ],
    SOME_FALL: (shot) => [
        {
            offset: 0,
            transform: shot.rotate,
            left: shot.startXpx,
            top: shot.startYpx,
        },
        {
            offset: 1,
            transform: shot.rotate,
            left: shot.finishXpx,
            top: shot.finishYpx,
        },
    ],
    EXPLODE: () => {
        const variants = [
            [
                {
                    offset: 0,
                    transform: 'scale(1) rotateX(0)',
                },
                {
                    offset: 0.5,
                    transform: 'scale(2) rotateX(-180deg)',
                },
                {
                    offset: 1,
                    transform: 'scale(0) rotateX(-360deg)',
                    backgroundColor: 'red',
                },
            ],
            [
                {
                    transform: 'scale(1)',
                    filter: 'blur(.01px)',
                },
                {
                    transform: 'scale(2)',
                    filter: 'blur(12px)',
                    opacity: 0,
                    backgroundColor: 'red',
                    backgroundColor: 'red',
                },
            ],
            [
                {
                    transform: 'scale(1)',
                },
                {
                    transform: 'scale(0.5)',
                    opacity: 0,
                    backgroundColor: 'red',
                },
            ],
            [
                {
                    transform: 'rotate(0)',
                },
                {
                    transform: 'rotate(360deg)',
                    backgroundColor: 'red',
                }
            ],
            [
                {
                    offset: 0,
                    transform: 'scale(1) rotate3d(-1, 1, 0, 0deg)',
                },
                {
                    offset: 0.5,
                    transform: 'scale(2) rotate3d(-1, 1, 0, 180deg)',
                },
                {
                    offset: 1,
                    transform: 'scale(1) rotate3d(-1, 1, 0, 360deg)',
                    backgroundColor: 'red',
                },
            ],
            [
                {
                    transform: 'none',
                },
                {
                    transform: 'translateX(1000px) scale(0.1) rotate3d(-1, 1, 0, 360deg)',
                    backgroundColor: 'red',
                },
            ],
            [
                {
                    transform: 'none',
                },
                {
                    transform: 'translate(1000px, 1000px) scale(0.1) rotate3d(-1, 1, 0, 360deg)',
                    backgroundColor: 'red',
                },
            ],
            [
                {
                    transform: 'none',
                },
                {
                    transform: 'translate(1000px, -1000px) scale(0.1) rotate3d(-1, 1, 0, 360deg)',
                    backgroundColor: 'red',
                },
            ],
        ];
        const ind = Math.floor(Math.random() * variants.length);
        return variants[ind];
    },
};