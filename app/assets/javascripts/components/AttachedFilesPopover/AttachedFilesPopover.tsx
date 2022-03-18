import { FOCUSABLE_BUT_NOT_TABBABLE } from '@/constants';
import { WebApplication } from '@/ui_models/application';
import { AppState } from '@/ui_models/app_state';
import { ContentType, SNFile, SNNote } from '@standardnotes/snjs';
import { FilesIllustration } from '@standardnotes/stylekit';
import { observer } from 'mobx-react-lite';
import { FunctionComponent } from 'preact';
import { StateUpdater, useEffect, useRef, useState } from 'preact/hooks';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { PopoverFileItem } from './PopoverFileItem';
import {
  PopoverFileItemAction,
  PopoverFileItemActionType,
} from './PopoverFileItemAction';

export enum PopoverTabs {
  AttachedFiles,
  AllFiles,
}

type Props = {
  application: WebApplication;
  appState: AppState;
  currentTab: PopoverTabs;
  closeOnBlur: (event: { relatedTarget: EventTarget | null }) => void;
  handleFileAction: (action: PopoverFileItemAction) => Promise<boolean>;
  isDraggingFiles: boolean;
  note: SNNote;
  setCurrentTab: StateUpdater<PopoverTabs>;
};

export const AttachedFilesPopover: FunctionComponent<Props> = observer(
  ({
    application,
    appState,
    currentTab,
    closeOnBlur,
    handleFileAction,
    isDraggingFiles,
    note,
    setCurrentTab,
  }) => {
    const [attachedFiles, setAttachedFiles] = useState<SNFile[]>([]);
    const [allFiles, setAllFiles] = useState<SNFile[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const filesList =
      currentTab === PopoverTabs.AttachedFiles ? attachedFiles : allFiles;

    const filteredList =
      searchQuery.length > 0
        ? filesList.filter(
            (file) =>
              file.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
          )
        : filesList;

    useEffect(() => {
      const unregisterFileStream = application.streamItems(
        ContentType.File,
        () => {
          setAttachedFiles(
            application.items
              .getFilesForNote(note)
              .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
          );

          setAllFiles(
            application
              .getItems(ContentType.File)
              .sort((a, b) =>
                a.created_at < b.created_at ? 1 : -1
              ) as SNFile[]
          );
        }
      );

      return () => {
        unregisterFileStream();
      };
    }, [application, note]);

    const handleAttachFilesClick = async () => {
      const uploadedFiles = await appState.files.uploadNewFile();
      if (!uploadedFiles) {
        return;
      }
      if (currentTab === PopoverTabs.AttachedFiles) {
        uploadedFiles.forEach((file) => {
          handleFileAction({
            type: PopoverFileItemActionType.AttachFileToNote,
            payload: file,
          });
        });
      }
    };

    return (
      <div
        className="flex flex-col"
        tabIndex={FOCUSABLE_BUT_NOT_TABBABLE}
        style={{
          border: isDraggingFiles
            ? '2px dashed var(--sn-stylekit-info-color)'
            : '',
        }}
      >
        <div className="flex border-0 border-b-1 border-solid border-main">
          <button
            className={`bg-default border-0 cursor-pointer px-3 py-2.5 relative focus:bg-info-backdrop focus:shadow-bottom ${
              currentTab === PopoverTabs.AttachedFiles
                ? 'color-info font-medium shadow-bottom'
                : 'color-text'
            }`}
            onClick={() => {
              setCurrentTab(PopoverTabs.AttachedFiles);
            }}
            onBlur={closeOnBlur}
          >
            Attached
          </button>
          <button
            className={`bg-default border-0 cursor-pointer px-3 py-2.5 relative focus:bg-info-backdrop focus:shadow-bottom ${
              currentTab === PopoverTabs.AllFiles
                ? 'color-info font-medium shadow-bottom'
                : 'color-text'
            }`}
            onClick={() => {
              setCurrentTab(PopoverTabs.AllFiles);
            }}
            onBlur={closeOnBlur}
          >
            All files
          </button>
        </div>
        <div className="min-h-0 max-h-110 overflow-y-auto">
          {filteredList.length > 0 || searchQuery.length > 0 ? (
            <div className="sticky top-0 left-0 p-3 bg-default border-0 border-b-1 border-solid border-main">
              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded py-1.5 px-3 text-input bg-default border-solid border-1 border-main"
                  placeholder="Search files..."
                  value={searchQuery}
                  onInput={(e) => {
                    setSearchQuery((e.target as HTMLInputElement).value);
                  }}
                  onBlur={closeOnBlur}
                  ref={searchInputRef}
                />
                {searchQuery.length > 0 && (
                  <button
                    className="flex absolute right-2 p-0 bg-transparent border-0 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    onBlur={closeOnBlur}
                  >
                    <Icon
                      type="clear-circle-filled"
                      className="color-neutral"
                    />
                  </button>
                )}
              </div>
            </div>
          ) : null}
          {filteredList.length > 0 ? (
            filteredList
              .filter((file) => !file.deleted)
              .map((file: SNFile) => {
                return (
                  <PopoverFileItem
                    key={file.uuid}
                    file={file}
                    isAttachedToNote={attachedFiles.includes(file)}
                    handleFileAction={handleFileAction}
                    getIconType={application.iconsController.getIconForFileType}
                    closeOnBlur={closeOnBlur}
                  />
                );
              })
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-8">
              <div className="w-18 h-18 mb-2">
                <FilesIllustration />
              </div>
              <div className="text-sm font-medium mb-3">
                {searchQuery.length > 0
                  ? 'No result found'
                  : currentTab === PopoverTabs.AttachedFiles
                  ? 'No files attached to this note'
                  : 'No files found in this account'}
              </div>
              <Button
                type="normal"
                onClick={handleAttachFilesClick}
                onBlur={closeOnBlur}
              >
                {currentTab === PopoverTabs.AttachedFiles ? 'Attach' : 'Upload'}{' '}
                files
              </Button>
              <div className="text-xs color-grey-0 mt-3">
                Or drop your files here
              </div>
            </div>
          )}
        </div>
        {filteredList.length > 0 && (
          <button
            className="sn-dropdown-item py-3 border-0 border-t-1px border-solid border-main focus:bg-info-backdrop"
            onClick={handleAttachFilesClick}
            onBlur={closeOnBlur}
          >
            <Icon type="add" className="mr-2 color-neutral" />
            {currentTab === PopoverTabs.AttachedFiles
              ? 'Attach'
              : 'Upload'}{' '}
            files
          </button>
        )}
      </div>
    );
  }
);