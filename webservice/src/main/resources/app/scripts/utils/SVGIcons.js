/**
  * Copyright 2017 Hortonworks.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *   http://www.apache.org/licenses/LICENSE-2.0
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
**/
import React from 'react';

const folder = (isClicked) =>{
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" title="folder">
  <path className="path1" fillRule="evenodd" clipRule="evenodd" d="M10.0012 3.99976H4.00122C2.90122 3.99976 2.01122 4.89976 2.01122 5.99976L2.00122 17.9998C2.00122 19.0998 2.90122 19.9998 4.00122 19.9998H20.0012C21.1012 19.9998 22.0012 19.0998 22.0012 17.9998V7.99976C22.0012 6.89976 21.1012 5.99976 20.0012 5.99976H12.0012L10.0012 3.99976Z" fill={isClicked ? "#1B6DE0" : "#999999"}/>
 </svg>;
};

const editIcon = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.59991 4.40015L11.5999 6.40015L3.33331 14.6668H1.33331V12.6668L9.59991 4.40015Z" fill="#999999"/>
                    <path d="M12.714 1.32617L11.0641 2.97607L13.044 4.95595L14.6939 3.30605L12.714 1.32617Z" fill="#999999"/>
                </svg>;

const graphIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM8.99902 17.0001H6.99902V10.0001H8.99902V17.0001ZM13.001 17.0001H11.001V7.00012H13.001V17.0001ZM17 17.0001H15V13.0001H17V17.0001Z" fill="#999999"/>
                  </svg>;

const actionShareIcon = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 10.7202C11.4933 10.7202 11.04 10.9202 10.6933 11.2335L5.94 8.46683C5.97333 8.3135 6 8.16016 6 8.00016C6 7.84016 5.97333 7.68683 5.94 7.5335L10.64 4.7935C11 5.12683 11.4733 5.3335 12 5.3335C13.1067 5.3335 14 4.44016 14 3.3335C14 2.22683 13.1067 1.3335 12 1.3335C10.8933 1.3335 10 2.22683 10 3.3335C10 3.4935 10.0267 3.64683 10.06 3.80016L5.36 6.54016C5 6.20683 4.52667 6.00016 4 6.00016C2.89333 6.00016 2 6.8935 2 8.00016C2 9.10683 2.89333 10.0002 4 10.0002C4.52667 10.0002 5 9.7935 5.36 9.46016L10.1067 12.2335C10.0733 12.3735 10.0533 12.5202 10.0533 12.6668C10.0533 13.7402 10.9267 14.6135 12 14.6135C13.0733 14.6135 13.9467 13.7402 13.9467 12.6668C13.9467 11.5935 13.0733 10.7202 12 10.7202Z" fill="#999999"/>
                        </svg>;

const shareIcon = <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.5 14.7411C15.8033 14.7411 15.18 15.0161 14.7033 15.447L8.1675 11.6428C8.21333 11.432 8.25 11.2211 8.25 11.0011C8.25 10.7811 8.21333 10.5703 8.1675 10.3595L14.63 6.59197C15.125 7.05031 15.7758 7.33447 16.5 7.33447C18.0217 7.33447 19.25 6.10614 19.25 4.58447C19.25 3.06281 18.0217 1.83447 16.5 1.83447C14.9783 1.83447 13.75 3.06281 13.75 4.58447C13.75 4.80447 13.7867 5.01531 13.8325 5.22614L7.37 8.99364C6.875 8.53531 6.22417 8.25114 5.5 8.25114C3.97833 8.25114 2.75 9.47947 2.75 11.0011C2.75 12.5228 3.97833 13.7511 5.5 13.7511C6.22417 13.7511 6.875 13.467 7.37 13.0086L13.8967 16.822C13.8508 17.0145 13.8233 17.2161 13.8233 17.4178C13.8233 18.8936 15.0242 20.0945 16.5 20.0945C17.9758 20.0945 19.1767 18.8936 19.1767 17.4178C19.1767 15.942 17.9758 14.7411 16.5 14.7411Z" fill="#999999"/>
                  </svg>;

const trashIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.99988 18.9997C5.99988 20.0997 6.89988 20.9997 7.99988 20.9997H15.9999C17.0999 20.9997 17.9999 20.0997 17.9999 18.9997V6.9997H5.99988V18.9997ZM18.9999 4H15.4999L14.4999 3H9.49988L8.49988 4H4.99988V6H18.9999V4Z" fill="#999999"/>
                  </svg>;

const clockIcon = <svg className="dropdown-icon" height="16" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.75 0.75C4.175 0.75 0.5 4.425 0.5 9C0.5 13.575 4.175 17.25 8.75 17.25C13.325 17.25 17 13.575 17 9C17 4.425 13.325 0.75 8.75 0.75ZM13.25 10.5H7.25V3H9.5V8.25H13.25V10.5Z" fill="#666666"/>
                  </svg>;

const dbIcon = <svg className="dropdown-icon" height="16" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.49984 0.791687C4.67067 0.791687 0.791504 3.08752 0.791504 5.93752C0.791504 5.93752 0.791504 10.2125 0.791504 13.0625C0.791504 15.9125 4.67067 18.2084 9.49984 18.2084C14.329 18.2084 18.2082 15.9125 18.2082 13.0625C18.2082 10.8459 18.2082 5.93752 18.2082 5.93752C18.2082 3.08752 14.329 0.791687 9.49984 0.791687ZM9.49984 3.16669C12.9832 3.16669 15.8332 4.75002 15.8332 5.93752C15.8332 7.60002 11.8748 8.70835 9.49984 8.70835C6.0165 8.70835 3.1665 7.12502 3.1665 5.93752C3.1665 4.27502 7.12484 3.16669 9.49984 3.16669Z" fill="#666666"/>
                </svg>;

const actionEllipsis =  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M3.99984 6.66675C3.2665 6.66675 2.6665 7.26675 2.6665 8.00008C2.6665 8.73341 3.2665 9.33341 3.99984 9.33341C4.73317 9.33341 5.33317 8.73341 5.33317 8.00008C5.33317 7.26675 4.73317 6.66675 3.99984 6.66675ZM12.0006 6.66675C11.2672 6.66675 10.6672 7.26675 10.6672 8.00008C10.6672 8.73341 11.2672 9.33341 12.0006 9.33341C12.7339 9.33341 13.3339 8.73341 13.3339 8.00008C13.3339 7.26675 12.7339 6.66675 12.0006 6.66675ZM8.00057 6.66675C7.26724 6.66675 6.66724 7.26675 6.66724 8.00008C6.66724 8.73341 7.26724 9.33341 8.00057 9.33341C8.7339 9.33341 9.3339 8.73341 9.3339 8.00008C9.3339 7.26675 8.7339 6.66675 8.00057 6.66675Z" fill="#999999"/>
                        </svg>;

const ellipsis =  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.99902 10C4.89902 10 3.99902 10.9 3.99902 12C3.99902 13.1 4.89902 14 5.99902 14C7.09902 14 7.99902 13.1 7.99902 12C7.99902 10.9 7.09902 10 5.99902 10ZM17.998 10.0005C16.898 10.0005 15.998 10.9005 15.998 12.0005C15.998 13.1005 16.898 14.0005 17.998 14.0005C19.098 14.0005 19.998 13.1005 19.998 12.0005C19.998 10.9005 19.098 10.0005 17.998 10.0005ZM11.998 10.0005C10.898 10.0005 9.99805 10.9005 9.99805 12.0005C9.99805 13.1005 10.898 14.0005 11.998 14.0005C13.098 14.0005 13.998 13.1005 13.998 12.0005C13.998 10.9005 13.098 10.0005 11.998 10.0005Z" fill="#999999"/>
                  </svg>;

const logoutIcon = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.66789 2H7.33456V8.66667H8.66789V2ZM11.8867 3.44646L10.94 4.39313C11.9933 5.23979 12.6667 6.53979 12.6667 7.99979C12.6667 10.5798 10.58 12.6665 8 12.6665C5.42 12.6665 3.33333 10.5798 3.33333 7.99979C3.33333 6.53979 4.00667 5.23979 5.05333 4.38646L4.11333 3.44646C2.82 4.54646 2 6.17313 2 7.99979C2 11.3131 4.68667 13.9998 8 13.9998C11.3133 13.9998 14 11.3131 14 7.99979C14 6.17313 13.18 4.54646 11.8867 3.44646Z" fill="#999999"/>
        </svg>;

const bugIcon = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M13.3337 5.33333H11.4603C11.1603 4.81333 10.747 4.36667 10.247 4.02667L11.3337 2.94L10.3937 2L8.94699 3.44667C8.64033 3.37333 8.32699 3.33333 8.00033 3.33333C7.67366 3.33333 7.36033 3.37333 7.06033 3.44667L5.60699 2L4.66699 2.94L5.74699 4.02667C5.25366 4.36667 4.84033 4.81333 4.54033 5.33333H2.66699V6.66667H4.06033C4.02699 6.88667 4.00033 7.10667 4.00033 7.33333V8H2.66699V9.33333H4.00033V10C4.00033 10.2267 4.02699 10.4467 4.06033 10.6667H2.66699V12H4.54033C5.23366 13.1933 6.52033 14 8.00033 14C9.48033 14 10.767 13.1933 11.4603 12H13.3337V10.6667H11.9403C11.9737 10.4467 12.0003 10.2267 12.0003 10V9.33333H13.3337V8H12.0003V7.33333C12.0003 7.10667 11.9737 6.88667 11.9403 6.66667H13.3337V5.33333ZM9.33431 10.6667H6.66764V9.33333H9.33431V10.6667ZM9.33431 8H6.66764V6.66667H9.33431V8Z" fill="#999999"/>
                </svg>;

const helpIcon = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99967 1.33337C4.31967 1.33337 1.33301 4.32004 1.33301 8.00004C1.33301 11.68 4.31967 14.6667 7.99967 14.6667C11.6797 14.6667 14.6663 11.68 14.6663 8.00004C14.6663 4.32004 11.6797 1.33337 7.99967 1.33337ZM8.66569 12.6668H7.33236V11.3335H8.66569V12.6668ZM10.0457 7.50012L9.44569 8.11346C8.96569 8.60012 8.66569 9.00012 8.66569 10.0001H7.33236V9.66679C7.33236 8.93345 7.63236 8.26679 8.11236 7.78012L8.93902 6.94012C9.18569 6.70012 9.33236 6.36679 9.33236 6.00012C9.33236 5.26679 8.73236 4.66679 7.99902 4.66679C7.26569 4.66679 6.66569 5.26679 6.66569 6.00012H5.33236C5.33236 4.52679 6.52569 3.33346 7.99902 3.33346C9.47236 3.33346 10.6657 4.52679 10.6657 6.00012C10.6657 6.58679 10.4257 7.12012 10.0457 7.50012Z" fill="#999999"/>
                  </svg>;

export default {
  editIcon,
  graphIcon,
  actionShareIcon,
  shareIcon,
  trashIcon,
  clockIcon,
  dbIcon,
  folder,
  actionEllipsis,
  ellipsis,
  logoutIcon,
  bugIcon,
  helpIcon
};
