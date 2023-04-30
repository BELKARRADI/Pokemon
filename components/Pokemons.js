import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';

const Pokemons = () => {
    const [pokemonData, setPokemonData] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json')
            .then(response => response.json())
            .then(data => setPokemonData(data.pokemon))
            .catch(error => console.log(error));
    }, []);

    const groupPokemonsByType = () => {
        const groupedPokemons = {};

        pokemonData.forEach(pokemon => {
            pokemon.type.forEach(type => {
                if (groupedPokemons[type]) {
                    groupedPokemons[type].push(pokemon);
                } else {
                    groupedPokemons[type] = [pokemon];
                }
            });
        });

        return groupedPokemons;
    };

    const renderPokemonCard = ({ item }) => (
        <TouchableOpacity style={styles.cardContainer} onPress={() => setSelectedPokemon(item)}>
            <Image source={{ uri: item.img }} style={styles.pokemonImage} />
            <Text style={styles.pokemonName}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderPokemonDetails = () => (
        <Modal visible={selectedPokemon !== null} animationType='slide'>
            <View style={styles.detailsContainer}>
                <Image source={{ uri: selectedPokemon?.img }} style={styles.detailsImage} />
                <Text style={styles.detailsName}>{selectedPokemon?.name}</Text>
                <Text style={styles.detailsInfo}>Type: {selectedPokemon?.type.join(', ')}</Text>
                <Text style={styles.detailsInfo}>Height: {selectedPokemon?.height}</Text>
                <Text style={styles.detailsInfo}>Weight: {selectedPokemon?.weight}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedPokemon(null)}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );

    const groupedPokemons = groupPokemonsByType();

    return (
        <ScrollView>
            <Text style={{ fontWeight: 'bold', fontSize: 30, fontStyle: 'italic', color: 'purple' ,marginBottom:50 , marginTop:50,marginLeft:100 }}>Pokémon List</Text>
            {Object.entries(groupedPokemons).map(([type, pokemons]) => (
                <View key={type}>
                <Text style={{ fontWeight: 'bold', fontSize: 30, fontStyle: 'italic', color: 'purple' ,marginBottom:50 , marginTop:50 }}>{type}:</Text>
                    <FlatList
                        data={pokemons}
                        keyExtractor={pokemon => pokemon.id.toString()}
                        numColumns={2}
                        renderItem={renderPokemonCard}
                    />
                </View>
            ))}
            {renderPokemonDetails()}
        </ScrollView>
    );
}



const styles = StyleSheet.create({
    heading: {
        fontSize: 24,
        textAlign: 'center',
        marginTop: 20
    },
    cardContainer: {
        backgroundColor: '#25D366',
        borderRadius: 17,
        marginBottom: 20,
        width: Dimensions.get('window').width / 2 - 30,
        marginLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    pokemonImage: {
        width: 70,
        height: 70,
        borderRadius: 35
    },
    pokemonName: {
        fontWeight: '700',
        marginLeft: 10
    },
    detailsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#25D366'
    },
    detailsImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20
    },
    detailsName: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 10
    },
    detailsInfo: {
        fontSize: 18,
        marginBottom: 10
    },
    closeButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 20
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: '700'
    }
});

export default Pokemons;

