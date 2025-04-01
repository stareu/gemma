import { Container, Sprite, Assets } from 'pixi.js';
import { Layout } from '@pixi/layout';

const assets = {
    bg: './img/home1.jpg',
};

class LayoutStory
{
    layout
    toolTip
    view = new Container();
    w;
    h;

    init(props)
    {
        Assets.load(assets.bg).then(() => {
			this.createLayout(props)
		})

		return this.view
    }

    createLayout({ width, height })
    {
        this.layout = new Layout({
            id: 'root',
            content: {
                content: Sprite.from(assets.bg),
                styles: {
                    position: 'center',
                    maxWidth: '100%',
                    maxHeight: '100%',
                },
            },
            styles: {
                background: 'red',
                position: 'center',
                width: `${width}%`,
                height: `${height}%`,
                overflow: 'hidden',
            },
        });
        this.resize(this.w, this.h);

        this.view.addChild(this.layout);
    }

    resize(w, h)
    {
        this.w = w;
        this.h = h;

        this.layout?.resize(w, h);
        this.toolTip?.resize(w, h);
    }
}

export const Fit = (params) => new LayoutStory(params);