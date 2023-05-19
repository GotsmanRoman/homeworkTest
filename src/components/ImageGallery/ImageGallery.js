import React from 'react';
import Loader from '../Loader/Loader';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import './ImageGallery.css';
import Button from '../Button/Button';
import fetchFoto from '../../api/api';
import Modal from '../Modal/Modal';

export default class ImageGallery extends React.Component {
  state = {
    fotos: [],
    currentPage: 1,
    loading: false,
    error: null,
    showModal: false,
    largeImage: '',
    total: 0,
    current: '',
  };

  async componentDidUpdate(prevProps, prevState) {
    if (
      this.props.nameSearch !== prevProps.nameSearch ||
      this.state.currentPage !== prevState.currentPage
    ) {
      this.getFoto();
    }
  }
  getFoto = async () => {
    const nameSearch = this.props.nameSearch;
    this.setState({ loading: true });
    try {
      const { hits, totalHits } = await fetchFoto(
        nameSearch,
        this.state.currentPage
      );
      this.setState(prevState => ({
        fotos: [...prevState.fotos, ...hits],
      }));
      this.setState({ total: totalHits });
      this.setState(prevState => ({
        current: prevState.current + hits.length,
      }));
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  };

  loadFoto = () => {
    this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
  };

  handleGalleryItem = largeImageSrc => {
    this.setState({
      largeImage: largeImageSrc,
      showModal: true,
    });
  };

  toggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      largeImage: '',
    }));
  };

  render() {
    const { fotos, showModal, largeImage } = this.state;
    //const needToShowLoadMore = fotos.length >= this.state.currentPage * 12;
    return (
      <div>
        {showModal && (
          <Modal onClose={this.toggleModal}>
            <img src={largeImage} alt="" />
          </Modal>
        )}
        <ul className="ImageGallery">
          {this.state.loading ? (
            <Loader />
          ) : (
            <ImageGalleryItem
              items={fotos}
              onImageClick={this.handleGalleryItem}
            />
          )}
        </ul>
        {fotos.length !== 0 && this.state.current !== this.state.total ? (
          <Button onLoadFoto={() => this.loadFoto} />
        ) : (
          false
        )}
      </div>
    );
  }
}
