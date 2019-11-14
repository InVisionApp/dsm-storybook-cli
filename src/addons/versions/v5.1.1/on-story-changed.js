import { STORY_CHANGED_EVENT } from '../../constants';
import { translateId } from '../../../versions/v5.1.1/url-utils';

const onStoryChanged = (api, cb) => {
  return api.on(STORY_CHANGED_EVENT, (id) => {
    const { kind, name } = translateId(id);
    cb(kind, name);

    // callback to remove from listeners
    return () => removeOnStoryChanged(api, cb);
  });
};

const removeOnStoryChanged = (api, cb) => {
  return api.off(STORY_CHANGED_EVENT, cb);
};

export { onStoryChanged };
